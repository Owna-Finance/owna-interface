import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
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

// Get pool at specific index
export function usePoolAtIndex(index: number) {
  const result = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(index)],
    query: {
      enabled: index >= 0,
    },
  });

    return result;
}

// Comprehensive hook for fetching all pool data
export function useLiquidityPoolsData() {
  const { data: poolsLength, isLoading: isLoadingLength, error: lengthError } = useAllPools();

  // Fixed hooks for first 10 pools (to avoid hooks order violation)
  const pool0 = usePoolAtIndex(0);
  const pool1 = usePoolAtIndex(1);
  const pool2 = usePoolAtIndex(2);
  const pool3 = usePoolAtIndex(3);
  const pool4 = usePoolAtIndex(4);
  const pool5 = usePoolAtIndex(5);
  const pool6 = usePoolAtIndex(6);
  const pool7 = usePoolAtIndex(7);
  const pool8 = usePoolAtIndex(8);
  const pool9 = usePoolAtIndex(9);

  // Fixed array of hook results
  const poolQueries = [pool0, pool1, pool2, pool3, pool4, pool5, pool6, pool7, pool8, pool9];

  // Only use pools up to the actual length
  const actualLength = poolsLength ? Math.min(Number(poolsLength), 10) : 0;

  const isLoading = poolQueries.slice(0, actualLength).some(query => query.isLoading) || isLoadingLength;
  const isError = poolQueries.slice(0, actualLength).some(query => query.isError) || !!lengthError;

  const pools = poolQueries
    .slice(0, actualLength)
    .filter(query => query.data !== undefined)
    .map(query => query.data as `0x${string}`);

  return {
    pools,
    isLoading,
    isError,
    poolsLength: poolsLength ? Number(poolsLength) : 0,
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