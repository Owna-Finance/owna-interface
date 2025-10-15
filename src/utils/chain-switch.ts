import { switchChain } from 'wagmi/actions';
import { config } from '@/lib/wagmi';
import { CHAIN } from '@/constants/chain';

/**
 * Switches wallet to Base Sepolia Testnet
 * @returns Promise that resolves when chain is switched
 */
export async function switchToBaseSepolia(): Promise<void> {
  try {
    await switchChain(config, { chainId: CHAIN.id });
  } catch (error) {
    console.error('Failed to switch chain:', error);
    throw new Error(`Failed to switch to ${CHAIN.name}. Please switch manually in your wallet.`);
  }
}

/**
 * Checks if current chain is Base Sepolia
 * @param chainId Current chain ID
 * @returns boolean indicating if chain is Base Sepolia
 */
export function isBaseSepolia(chainId: number): boolean {
  return chainId === CHAIN.id;
}

/**
 * Gets the Base Sepolia chain info
 */
export function getBaseSepoliaChain() {
  return CHAIN;
}