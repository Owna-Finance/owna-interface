import { CHAIN_ID } from '@/constants/chain';

/**
 * Ensures the transaction is executed on Base Sepolia Testnet only
 * Throws an error if wrong chain is detected
 */
export function validateBaseSepolia(chainId: number | undefined): void {
  if (chainId !== CHAIN_ID) {
    throw new Error(
      `This application only supports Base Sepolia Testnet (Chain ID: ${CHAIN_ID}). ` +
      `Please switch your wallet to Base Sepolia Testnet to continue.`
    );
  }
}

/**
 * Hook to check if current chain is Base Sepolia
 */
export function useChainValidation(chainId: number | undefined): boolean {
  try {
    validateBaseSepolia(chainId);
    return true;
  } catch (error) {
    console.error('Chain validation error:', error);
    return false;
  }
}

/**
 * Error message for wrong chain
 */
export const WRONG_CHAIN_ERROR = `Please switch to Base Sepolia Testnet (Chain ID: ${CHAIN_ID}) to use this application.`;