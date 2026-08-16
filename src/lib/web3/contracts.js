
import { ethers } from 'ethers';
import { loadAbi } from './abi';
import { loadDeployment } from './deployment';
import { getRpcUrl } from './networks';

export async function getReadProvider() {
  const deployment = await loadDeployment();
  return new ethers.JsonRpcProvider(getRpcUrl(deployment.chainId));
}

/**
 * Build the contract set.
 * @param runner an ethers Provider (read-only, no wallet needed) or Signer (writes).
 */
export async function getContracts(runner) {
  const deployment = await loadDeployment();

  const [membershipAbi, tokenAbi, controllerAbi, usdcAbi, usdtAbi] = await Promise.all([
    loadAbi('TokenizableMembership'),
    loadAbi('TokenizableGovernanceToken'),
    loadAbi('MintController'),
    loadAbi('MockUSDC'),
    loadAbi('MockUSDT'),
  ]);

  return {
    deployment,
    membership: new ethers.Contract(deployment.membershipAddress, membershipAbi, runner),
    governanceToken: new ethers.Contract(deployment.governanceTokenAddress, tokenAbi, runner),
    controller: new ethers.Contract(deployment.mintControllerAddress, controllerAbi, runner),
    // The MockUSDC ABI is ERC-20 + EIP-2612 + version(), which is a superset-compatible
    // read/write surface for real Circle USDC. MockUSDT mirrors permit-less USDT.
    usdc: new ethers.Contract(deployment.usdcAddress, usdcAbi, runner),
    usdt: new ethers.Contract(deployment.usdtAddress, usdtAbi, runner),
  };
}

/** Public, wallet-free reads (supply, prices, membership counts). */
export async function readPublicStats() {
  const provider = await getReadProvider();
  const { membership, governanceToken, controller } = await getContracts(provider);

  const [totalMinted, totalSupply, foundingPrice, patronPrice, treasury] = await Promise.all([
    membership.totalMinted(),
    governanceToken.totalSupply(),
    controller.FOUNDING_PRICE(),
    controller.PATRON_PRICE(),
    controller.treasury(),
  ]);

  return {
    totalMinted: Number(totalMinted),
    tknSupply: ethers.formatEther(totalSupply),
    foundingPrice,
    patronPrice,
    treasury,
  };
}
