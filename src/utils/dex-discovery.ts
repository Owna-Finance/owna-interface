import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_ROUTER_ABI } from '@/constants/abis/DEX_ROUTER_ABI';

/**
 * DEX Factory Discovery Utilities
 *
 * DEX Router acts as interface to discover and interact with DEX Factory
 * All pool operations go through DEX Router, which internally manages DEX Factory
 */

/**
 * Hook to get DEX Factory address from DEX Router
 */
export function useDEXFactory() {
  return useReadContract({
    address: CONTRACTS.DEX_ROUTER as `0x${string}`,
    abi: DEX_ROUTER_ABI,
    functionName: 'factory',
    query: {
      enabled: true,
    }
  });
}

/**
 * Hook to get pool information by token pair
 * This queries DEX Router which internally checks DEX Factory for pools
 */
export function usePoolInfo(tokenA: `0x${string}`, tokenB: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.DEX_ROUTER as `0x${string}`,
    abi: DEX_ROUTER_ABI,
    functionName: 'getPair', // Assuming this function exists in DEX Router
    args: [tokenA, tokenB],
    query: {
      enabled: !!tokenA && !!tokenB && tokenA !== tokenB,
    }
  });
}

/**
 * Hook to get amounts out for a swap
 * This calculates expected output amounts through DEX Router
 */
export function useGetAmountsOut(amountIn: string, path: `0x${string}`[]) {
  const { parseUnits } = require('viem');

  return useReadContract({
    address: CONTRACTS.DEX_ROUTER as `0x${string}`,
    abi: DEX_ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: [
      parseUnits(amountIn || '0', 18),
      path
    ],
    query: {
      enabled: !!amountIn && !!path && path.length >= 2 && amountIn !== '0',
    }
  });
}

/**
 * Hook to get amount in for expected output
 */
export function useGetAmountIn(amountOut: string, path: `0x${string}`[]) {
  const { parseUnits } = require('viem');

  return useReadContract({
    address: CONTRACTS.DEX_ROUTER as `0x${string}`,
    abi: DEX_ROUTER_ABI,
    functionName: 'getAmountsIn',
    args: [
      parseUnits(amountOut || '0', 18),
      path
    ],
    query: {
      enabled: !!amountOut && !!path && path.length >= 2 && amountOut !== '0',
    }
  });
}

/**
 * Hook to get quote for token swap
 */
export function useQuote(amountA: string, reserveA: bigint, reserveB: bigint) {
  const { parseUnits } = require('viem');

  return useReadContract({
    address: CONTRACTS.DEX_ROUTER as `0x${string}`,
    abi: DEX_ROUTER_ABI,
    functionName: 'quote',
    args: [
      parseUnits(amountA || '0', 18),
      reserveA,
      reserveB
    ],
    query: {
      enabled: !!amountA && !!reserveA && !!reserveB && amountA !== '0',
    }
  });
}

/**
 * Utility function to create token path for swaps
 */
export function createTokenPath(tokenIn: `0x${string}`, tokenOut: `0x${string}`): `0x${string}`[] {
  // For direct swaps, path is just [tokenIn, tokenOut]
  // For multi-hop swaps, intermediate tokens would be added
  return [tokenIn, tokenOut];
}

/**
 * Utility function to check if tokens form a valid pair
 */
export function isValidTokenPair(tokenA: `0x${string}`, tokenB: `0x${string}`): boolean {
  return (
    tokenA !== tokenB &&
    tokenA.startsWith('0x') &&
    tokenB.startsWith('0x') &&
    tokenA.length === 42 &&
    tokenB.length === 42
  );
}

/**
 * DEX Pool Information Interface
 */
export interface PoolInfo {
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  reserveA: bigint;
  reserveB: bigint;
  totalSupply: bigint;
  fee: number;
}

/**
 * Hook to get all pools information (if DEX Router supports this)
 * This would typically query DEX Factory through DEX Router
 */
export function useAllPools() {
  // This would depend on the actual DEX Router implementation
  // For now, returning empty array as placeholder
  return {
    data: [] as PoolInfo[],
    isLoading: false,
    error: null,
  };
}