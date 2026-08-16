
export const LOCAL_CHAIN_ID = 31337;
export const AMOY_CHAIN_ID = 80002;
export const POLYGON_CHAIN_ID = 137;

/**
 * True when the app is running as a hosted production build (Vercel/Cloudflare).
 * In that case we read public/deployment.json and hit a live public RPC.
 */
export function isProductionRuntime() {
  const flag = import.meta.env.VITE_VERCEL_ENV;
  if (flag) return flag === 'production';
  return Boolean(import.meta.env.PROD);
}

/** Full absolute URL of the dev RPC proxy — never a bare path. */
export function localRpcUrl() {
  if (typeof window === 'undefined') return 'http://127.0.0.1:3000/api/rpc';
  return `${window.location.origin}/api/rpc`;
}

export function getRpcUrl(chainId) {
  switch (Number(chainId)) {
    case 1:
      return 'https://ethereum-rpc.publicnode.com';
    case 10:
      return 'https://optimism-rpc.publicnode.com';
    case 56:
      return 'https://bsc-rpc.publicnode.com';
    case 137:
      return 'https://polygon-bor-rpc.publicnode.com';
    case 11155111:
      return 'https://ethereum-sepolia-rpc.publicnode.com';
    case 42161:
      return 'https://arbitrum-one-rpc.publicnode.com';
    case 80002:
      return 'https://rpc-amoy.polygon.technology';
    case LOCAL_CHAIN_ID:
      return localRpcUrl();
    default:
      if (!isProductionRuntime()) return localRpcUrl();
      throw new Error(
        `[web3] No RPC URL configured for chainId ${chainId}. Add it to src/lib/web3/networks.js.`
      );
  }
}

export function getExplorerTxUrl(chainId, txHash) {
  switch (Number(chainId)) {
    case 137:
      return `https://polygonscan.com/tx/${txHash}`;
    case 80002:
      return `https://amoy.polygonscan.com/tx/${txHash}`;
    default:
      return '';
  }
}

export function getChainLabel(chainId) {
  switch (Number(chainId)) {
    case 137:
      return 'Polygon';
    case 80002:
      return 'Polygon Amoy';
    case LOCAL_CHAIN_ID:
      return 'Local Hardhat chain';
    default:
      return `chain ${chainId}`;
  }
}
