import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';
import { CHAIN } from '@/constants/chain';

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id';

// Base Sepolia Testnet Only Configuration
export const config = createConfig({
  chains: [CHAIN], // ✅ Only Base Sepolia Testnet
  connectors: [
    metaMask(),
    walletConnect({
      projectId,
      showQrModal: false, // Hide QR modal for better UX
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [CHAIN.id]: http(), // ✅ Only Base Sepolia RPC
  },
});