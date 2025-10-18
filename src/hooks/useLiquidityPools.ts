import { useReadContract, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';
import { DEX_ROUTER_ABI } from '@/constants/abis/DEX_ROUTER_ABI';
import { YRT_TOKEN_ABI } from '@/constants/abis/YRT_TOKEN_ABI';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { OWNA_POOL_ABI } from '@/constants/abis/OWNA_POOL_ABI';
import { USDC_ABI } from '@/constants/abis/USDCAbi';
import { IDRX_ABI } from '@/constants/abis/IDRXAbi';

export interface LiquidityPool {
  address: `0x${string}`;
  tokenA: {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
  };
  tokenB: {
    address: `0x${string}`;
    symbol: string;
    name: string;
    decimals: number;
  };
  propertyName: string;
  propertyOwner: `0x${string}`;
  reserveA: string;
  reserveB: string;
  totalSupply: string;
  apr?: string;
  volume24h?: string;
  fee24h?: string;
  tvl: string;
  createdAt?: string;
}

export interface PoolSummary {
  address: `0x${string}`;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  propertyName: string;
  propertyOwner: `0x${string}`;
}

// Factory hook to get all pools
export function useAllPools() {
  return useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPoolsLength',
    query: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  });
}

// Get specific pool info
export function usePoolInfo(poolAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'getReserves',
    query: {
      enabled: !!poolAddress,
    },
  });
}

// Get pool by token pair
export function useGetPool(tokenA: `0x${string}` | undefined, tokenB: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'getPool',
    args: [tokenA, tokenB],
    query: {
      enabled: !!tokenA && !!tokenB,
    },
  });
}

// Comprehensive hook for fetching all pool data using multicall
export function useLiquidityPoolsData() {
  const publicClient = usePublicClient();
  const { data: poolsLength, isLoading: isLoadingLength, error: lengthError } = useAllPools();
  const [pools, setPools] = useState<`0x${string}`[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchPools() {
      if (!poolsLength || Number(poolsLength) === 0 || !publicClient) {
        setPools([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsError(false);

        // Limit to 20 pools for performance reasons
        const maxPools = Math.min(Number(poolsLength), 20);

        // Use multicall to fetch all pools at once
        const poolContracts = Array.from({ length: maxPools }, (_, i) => ({
          address: CONTRACTS.DEX_FACTORY as `0x${string}`,
          abi: DEX_FACTORY_ABI,
          functionName: 'allPools' as const,
          args: [BigInt(i)],
        }));

        const results = await publicClient.multicall({
          contracts: poolContracts as any,
          allowFailure: true,
        });

        const validPools = results
          .filter((result): result is { status: 'success'; result: `0x${string}` } =>
            result.status === 'success' && typeof result.result === 'string'
          )
          .map(result => result.result);

        setPools(validPools);
      } catch (error) {
        console.error('Error fetching pools:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (poolsLength !== undefined && !isLoadingLength) {
      fetchPools();
    }
  }, [poolsLength, isLoadingLength, publicClient]);

  return {
    pools,
    isLoading: isLoading || isLoadingLength,
    isError: isError || !!lengthError,
    poolsLength: poolsLength ? Number(poolsLength) : 0,
    maxPoolsFetched: pools.length,
  };
}

// Hook for detailed pool information including reserves and TVL
export function usePoolDetails(poolAddress: `0x${string}` | undefined) {
  const { data: reserves, isLoading: isLoadingReserves } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'getReserves',
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: token0, isLoading: isLoadingToken0 } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'token0',
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: token1, isLoading: isLoadingToken1 } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'token1',
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: totalSupply, isLoading: isLoadingSupply } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!poolAddress,
    },
  });

  const { data: propertyName, isLoading: isLoadingPropertyName } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'propertyName',
    query: {
      enabled: !!poolAddress,
    },
  });

  const isLoading = isLoadingReserves || isLoadingToken0 || isLoadingToken1 || isLoadingSupply || isLoadingPropertyName;

  return {
    reserves,
    token0,
    token1,
    totalSupply,
    propertyName,
    isLoading,
  };
}

// Get token info (symbol, name, decimals)
export function useTokenInfo(tokenAddress: `0x${string}` | undefined) {
  const isUSDC = tokenAddress === CONTRACTS.USDC;
  const isIDRX = tokenAddress === CONTRACTS.IDRX;

  const { data: symbol, isLoading: isLoadingSymbol } = useReadContract({
    address: tokenAddress,
    abi: isUSDC ? USDC_ABI : isIDRX ? IDRX_ABI : YRT_TOKEN_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: name, isLoading: isLoadingName } = useReadContract({
    address: tokenAddress,
    abi: isUSDC ? USDC_ABI : isIDRX ? IDRX_ABI : YRT_TOKEN_ABI,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: decimals, isLoading: isLoadingDecimals } = useReadContract({
    address: tokenAddress,
    abi: isUSDC ? USDC_ABI : isIDRX ? IDRX_ABI : YRT_TOKEN_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    symbol,
    name,
    decimals: decimals ? Number(decimals) : 18,
    isLoading: isLoadingSymbol || isLoadingName || isLoadingDecimals,
  };
}

// Hook to get YRT series info from factory
export function useYRTSeriesInfo(seriesId: string | number) {
  return useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesInfo',
    args: [BigInt(seriesId)],
    query: {
      enabled: seriesId !== undefined && seriesId !== '',
    },
  });
}

// Simple pool list for debugging
export { useSimplePoolList } from './useSimplePoolList';