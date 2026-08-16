
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { hardhat, polygon, polygonAmoy } from 'wagmi/chains';
import { getRpcUrl, localRpcUrl } from './networks';

const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '46f0c9b15ee3f64ee8fbfef4a42b4ac6';

export const supportedChains = [polygonAmoy, polygon, hardhat];

export const wagmiConfig = getDefaultConfig({
  appName: 'Tokenizable',
  appDescription: 'Crowd-owned community meetup platform',
  projectId,
  chains: supportedChains,
  transports: {
    [polygonAmoy.id]: http(getRpcUrl(polygonAmoy.id)),
    [polygon.id]: http(getRpcUrl(polygon.id)),
    [hardhat.id]: http(localRpcUrl()),
  },
  ssr: false,
});

export const privyChains = [polygonAmoy, polygon];
