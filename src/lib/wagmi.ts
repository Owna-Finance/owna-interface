import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { coinbaseWallet, metaMask, injected } from 'wagmi/connectors';
import { CHAIN } from '@/constants/chain';

// Base Sepolia Testnet Only Configuration with Coinbase Wallet focus
export const config = createConfig({
  chains: [CHAIN], // ✅ Only Base Sepolia Testnet
  connectors: [
    coinbaseWallet({
      appName: 'Owna Finance',
      appLogoUrl: 'https://owna.finance/logo.png', // Update with your logo
      preference: 'all', // Allow all wallet options from Coinbase
    }),
    metaMask(),
    injected({
      shimDisconnect: true,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  batch: {
    multicall: true,
  },
  transports: {
    [CHAIN.id]: http(), // ✅ Only Base Sepolia RPC
  },
});