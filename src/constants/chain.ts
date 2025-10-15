import { baseSepolia } from 'viem/chains';

// Chain Configuration - Base Sepolia Testnet Only
export const CHAIN = baseSepolia;
export const CHAIN_ID = baseSepolia.id;
export const CHAIN_NAME = baseSepolia.name;
export const CHAIN_CURRENCY = baseSepolia.nativeCurrency;

// Network Information
export const NETWORK_INFO = {
  name: CHAIN_NAME,
  chainId: CHAIN_ID,
  currency: CHAIN_CURRENCY,
  rpcUrl: 'https://sepolia.base.org',
  blockExplorerUrl: 'https://sepolia.basescan.org',
  isTestnet: true,
} as const;

// Faucet URLs
export const FAUCETS = {
  ETH: 'https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet',
  LINK: 'https://faucets.chain.link/base-sepolia',
} as const;

// Chain Validation Helper
export function isBaseSepolia(chainId?: number): boolean {
  return chainId === CHAIN_ID;
}

// Transaction Explorer URL Generator
export function getExplorerUrl(type: 'tx' | 'address' | 'token', value: string): string {
  const baseUrl = NETWORK_INFO.blockExplorerUrl;

  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'address':
      return `${baseUrl}/address/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    default:
      return baseUrl;
  }
}