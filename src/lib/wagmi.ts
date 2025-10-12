import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia, mainnet } from 'viem/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [
    metaMask(),
    walletConnect({
      projectId,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});