'use client';

import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, createStorage, cookieStorage } from 'wagmi';
import { base, baseSepolia, mainnet } from 'viem/chains';
import '@rainbow-me/rainbowkit/styles.css';
import '@coinbase/onchainkit/styles.css';

const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        coinbaseWallet,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'Owna Finance',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
  }
);

const config = createConfig({
  connectors,
  chains: [base, baseSepolia, mainnet],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
});

export function OnchainProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
        >
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}