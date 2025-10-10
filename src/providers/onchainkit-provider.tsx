'use client';

import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
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

const onchainKitApiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
const enableOnchainAnalytics = process.env.NEXT_PUBLIC_ONCHAINKIT_ANALYTICS === 'true';
const shouldUseOnchainKit = Boolean(
  onchainKitApiKey && process.env.NEXT_PUBLIC_ENABLE_ONCHAINKIT === 'true'
);

type OnchainKitProviderComponent = ComponentType<{
  apiKey?: string;
  analytics?: boolean;
  chain: typeof base;
  children: React.ReactNode;
}>;

export function OnchainProviders({ children }: { children: React.ReactNode }) {
  const [OnchainKitProvider, setOnchainKitProvider] = useState<OnchainKitProviderComponent | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!shouldUseOnchainKit) {
      setOnchainKitProvider(null);
      return () => {
        isMounted = false;
      };
    }

    import('@coinbase/onchainkit')
      .then((onchainKitModule) => {
        if (!isMounted) return;
        if (onchainKitModule?.OnchainKitProvider) {
          setOnchainKitProvider(() => onchainKitModule.OnchainKitProvider);
        } else {
          console.warn('OnchainKitProvider missing from module; using RainbowKit only.');
          setOnchainKitProvider(null);
        }
      })
      .catch((error) => {
        console.warn('Failed to load OnchainKitProvider; using RainbowKit only.', error);
        if (isMounted) {
          setOnchainKitProvider(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [shouldUseOnchainKit]);

  useEffect(() => {
    if (!shouldUseOnchainKit && process.env.NODE_ENV === 'development') {
      console.warn(
        'OnchainKitProvider disabled. Set NEXT_PUBLIC_ONCHAINKIT_API_KEY and NEXT_PUBLIC_ENABLE_ONCHAINKIT=true to enable.'
      );
    }
  }, [shouldUseOnchainKit]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {shouldUseOnchainKit && OnchainKitProvider ? (
          <OnchainKitProvider
            apiKey={onchainKitApiKey}
            analytics={enableOnchainAnalytics}
            chain={base}
          >
            <RainbowKitProvider>
              {children}
            </RainbowKitProvider>
          </OnchainKitProvider>
        ) : (
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
