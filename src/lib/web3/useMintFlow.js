
import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { getContracts } from './contracts';
import { getContributorSignature } from './contributorSignature';
import { useActiveSigner } from './useActiveSigner';

const SIGS = {
  foundingPermit: 'mintFounding(address,uint256,uint256,uint8,bytes32,bytes32)',
  foundingApprove: 'mintFounding(address,uint256)',
  patronPermit: 'mintPatron(address,uint256,uint256,uint8,bytes32,bytes32)',
  patronApprove: 'mintPatron(address,uint256)',
};

function readableError(error) {
  const code = error?.code ?? error?.info?.error?.code;
  if (code === 4001 || code === 'ACTION_REJECTED') {
    return 'You rejected the request in your wallet. Nothing was charged.';
  }
  if (error?.shortMessage) return error.shortMessage;
  if (error?.reason) return error.reason;
  return error?.message || 'The transaction could not be completed.';
}

export function useMintFlow() {
  const signerCtx = useActiveSigner();
  const { isLocal, getSigner } = signerCtx;

  const [status, setStatus] = useState('idle');
  const [step, setStep] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setStep('');
    setError('');
    setResult(null);
  }, []);

  const sendTx = useCallback(
    async (fn, args) => {
      const overrides = {};
      const estimate = await fn.estimateGas(...args);
      if (isLocal) overrides.gasLimit = (estimate * 120n) / 100n;
      const tx = await fn(...args, overrides);
      const receipt = await tx.wait();
      return { tx, receipt };
    },
    [isLocal]
  );

  const signPermit = useCallback(async ({ token, signer, spender, value, deadline }) => {
    const owner = await signer.getAddress();
    const network = await signer.provider.getNetwork();

    let version = '1';
    try {
      version = await token.version();
    } catch {
      version = '1';
    }

    const domain = {
      name: await token.name(),
      version,
      chainId: Number(network.chainId),
      verifyingContract: await token.getAddress(),
    };
    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };
    const message = {
      owner,
      spender,
      value,
      nonce: await token.nonces(owner),
      deadline,
    };

    const raw = await signer.signTypedData(domain, types, message);
    return ethers.Signature.from(raw);
  }, []);

  const paidMint = useCallback(
    async ({ tier, currency }) => {
      reset();
      setStatus('working');
      try {
        setStep('Preparing wallet');
        const signer = await getSigner();
        const me = await signer.getAddress();
        const { controller, usdc, usdt, deployment } = await getContracts(signer);

        const stable = currency === 'usdc' ? usdc : usdt;
        const stableAddress = await stable.getAddress();
        const controllerAddress = await controller.getAddress();
        const price = tier === 'patron' ? await controller.PATRON_PRICE() : await controller.FOUNDING_PRICE();

        const balance = await stable.balanceOf(me);
        if (balance < price) {
          throw new Error(
            `Insufficient ${currency.toUpperCase()} balance — you need ${ethers.formatUnits(price, 6)} ${currency.toUpperCase()}, wallet holds ${ethers.formatUnits(balance, 6)}.`
          );
        }

        let outcome;
        if (currency === 'usdc') {
          setStep('Signing the USDC permit (no gas, no approval tx)');
          const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
          const sig = await signPermit({
            token: stable,
            signer,
            spender: controllerAddress,
            value: price,
            deadline,
          });
          setStep('Confirm the mint transaction');
          const fn = controller.getFunction(tier === 'patron' ? SIGS.patronPermit : SIGS.foundingPermit);
          outcome = await sendTx(fn, [stableAddress, price, deadline, sig.v, sig.r, sig.s]);
        } else {
          const allowance = await stable.allowance(me, controllerAddress);
          if (allowance < price) {
            setStep('Step 1 of 2 — approve USDT');
            await sendTx(stable.getFunction('approve'), [controllerAddress, price]);
          }
          setStep('Step 2 of 2 — confirm the mint');
          const fn = controller.getFunction(tier === 'patron' ? SIGS.patronApprove : SIGS.foundingApprove);
          outcome = await sendTx(fn, [stableAddress, price]);
        }

        let vestingWallet = '';
        if (tier === 'patron') {
          vestingWallet = await controller.vestingWalletOf(me);
        }

        setStatus('success');
        setStep('');
        setResult({
          tier,
          txHash: outcome.tx.hash,
          chainId: Number(deployment.chainId),
          tknAmount: tier === 'patron' ? '10,000' : '500',
          vestingWallet,
        });
        return outcome;
      } catch (thrown) {
        setStatus('error');
        setStep('');
        setError(readableError(thrown));
        throw thrown;
      }
    },
    [getSigner, reset, sendTx, signPermit]
  );

  const contributorMint = useCallback(async () => {
    reset();
    setStatus('working');
    try {
      setStep('Requesting an allowlist approval from the DAO signer');
      const signer = await getSigner();
      const me = await signer.getAddress();
      const approval = await getContributorSignature(me);

      const { controller, deployment } = await getContracts(signer);
      setStep('Confirm the free mint');
      const outcome = await sendTx(controller.getFunction('mintContributor'), [
        approval.signature,
        BigInt(approval.nonce),
        BigInt(approval.expiry),
      ]);

      setStatus('success');
      setStep('');
      setResult({
        tier: 'contributor',
        txHash: outcome.tx.hash,
        chainId: Number(deployment.chainId),
        tknAmount: '500',
        vestingWallet: '',
      });
      return outcome;
    } catch (thrown) {
      setStatus('error');
      setStep('');
      setError(readableError(thrown));
      throw thrown;
    }
  }, [getSigner, reset, sendTx]);

  /** Local Hardhat convenience: account #0 owns the mock stablecoins, so it can self-fund. */
  const fundLocalBalances = useCallback(async () => {
    reset();
    setStatus('working');
    try {
      setStep('Minting test stablecoins on the local chain');
      const signer = await getSigner();
      const me = await signer.getAddress();
      const { usdc, usdt, controller } = await getContracts(signer);
      const amount = (await controller.PATRON_PRICE()) * 3n;
      await sendTx(usdc.getFunction('mint'), [me, amount]);
      await sendTx(usdt.getFunction('mint'), [me, amount]);
      setStatus('idle');
      setStep('');
    } catch (thrown) {
      setStatus('error');
      setStep('');
      setError(readableError(thrown));
    }
  }, [getSigner, reset, sendTx]);

  return {
    ...signerCtx,
    status,
    step,
    error,
    result,
    reset,
    paidMint,
    contributorMint,
    fundLocalBalances,
  };
}
