
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useSwitchChain } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { isProductionRuntime, localRpcUrl, LOCAL_CHAIN_ID } from './networks';
import { loadDeployment } from './deployment';

/**
 * One signer abstraction for three situations:
 *  - local Hardhat chain  -> unlocked account #0, no wallet, no signing prompts
 *  - crypto-native user   -> injected wallet connected through RainbowKit / wagmi
 *  - email-first user     -> Privy embedded wallet
 */
export function useActiveSigner() {
  const isLocal = !isProductionRuntime();

  const { address: wagmiAddress, chainId: wagmiChainId, isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  const [deployment, setDeployment] = useState(null);
  const [deploymentError, setDeploymentError] = useState('');
  const [localAddress, setLocalAddress] = useState('');

  useEffect(() => {
    let alive = true;
    loadDeployment()
      .then((data) => alive && setDeployment(data))
      .catch((error) => alive && setDeploymentError(error.message));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLocal) return undefined;
    let alive = true;
    (async () => {
      try {
        const provider = new ethers.JsonRpcProvider(localRpcUrl());
        const signer = await provider.getSigner(0);
        const address = await signer.getAddress();
        if (alive) setLocalAddress(address);
      } catch {
        if (alive) setLocalAddress('');
      }
    })();
    return () => {
      alive = false;
    };
  }, [isLocal]);

  const privyWallet = useMemo(() => (wallets && wallets.length ? wallets[0] : null), [wallets]);

  const targetChainId = deployment ? Number(deployment.chainId) : LOCAL_CHAIN_ID;
  const address = isLocal ? localAddress : wagmiAddress || privyWallet?.address || '';
  const chainId = isLocal ? LOCAL_CHAIN_ID : wagmiChainId || targetChainId;
  const connected = Boolean(address);

  const getSigner = useCallback(async () => {
    if (isLocal) {
      const provider = new ethers.JsonRpcProvider(localRpcUrl());
      return provider.getSigner(0);
    }

    let eip1193 = null;
    if (isConnected && typeof window !== 'undefined' && window.ethereum) {
      eip1193 = window.ethereum;
    } else if (privyWallet) {
      try {
        await privyWallet.switchChain(targetChainId);
      } catch {
        /* Privy will surface its own prompt if the switch is refused */
      }
      eip1193 = await privyWallet.getEthereumProvider();
    }

    if (!eip1193) {
      throw new Error('Connect a wallet or sign in with email before minting.');
    }

    const browserProvider = new ethers.BrowserProvider(eip1193);
    const network = await browserProvider.getNetwork();

    if (Number(network.chainId) !== targetChainId) {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: targetChainId });
      } else {
        throw new Error(`Switch your wallet to chain ${targetChainId} and try again.`);
      }
    }

    return browserProvider.getSigner();
  }, [isLocal, isConnected, privyWallet, switchChainAsync, targetChainId]);

  return {
    isLocal,
    address,
    chainId,
    targetChainId,
    wrongNetwork: !isLocal && connected && Number(chainId) !== targetChainId,
    connected,
    privyAuthenticated: Boolean(authenticated),
    deployment,
    deploymentError,
    getSigner,
    switchToTarget: () => (switchChainAsync ? switchChainAsync({ chainId: targetChainId }) : null),
  };
}
