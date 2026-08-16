
import React, { useMemo } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { PrivyProvider } from '@privy-io/react-auth';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { wagmiConfig } from '@/lib/web3/wagmiConfig';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'cmst8z6o800qh0cl1i2fvoh2h';

export default function Web3Providers({ children }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      }),
    []
  );

  const rainbowTheme = useMemo(
    () =>
      darkTheme({
        accentColor: '#FF5C28',
        accentColorForeground: '#0A0A0F',
        borderRadius: 'small',
        fontStack: 'system',
        overlayBlur: 'small',
      }),
    []
  );

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        embeddedWallets: { createOnLogin: 'users-without-wallets', noPromptOnSignature: false },
        defaultChain: polygonAmoy,
        supportedChains: [polygonAmoy, polygon],
        appearance: {
          theme: 'dark',
          accentColor: '#FF5C28',
          logo: undefined,
          showWalletLoginFirst: false,
        },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowTheme} modalSize="compact">
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
