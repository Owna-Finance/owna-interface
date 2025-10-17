import { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { PoolInfo } from './useDEX';
import { CONTRACTS } from '@/constants/contracts/contracts';

// ABI for Factory
const FACTORY_ABI = [
  {
    inputs: [],
    name: 'allPoolsLength',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'allPools',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// ABI for Pool
const POOL_ABI = [
  {
    inputs: [],
    name: 'token0',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'token1',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      { name: 'reserve0', type: 'uint256' },
      { name: 'reserve1', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'propertyName',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'swapFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// ABI for ERC20
const ERC20_ABI = [
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export function useAllPools() {
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get total pools count
  const { data: poolsLength, isLoading: isLoadingLength } = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'allPoolsLength',
  });

  useEffect(() => {
    const fetchPools = async () => {
      if (isLoadingLength) {
        setIsLoading(true);
        return;
      }

      if (!poolsLength || Number(poolsLength) === 0) {
        setIsLoading(false);
        setPools([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const poolCount = Number(poolsLength);
        console.log(`Fetching ${poolCount} pools from factory...`);

        // For now, return empty array until pools are created
        // In production, you would fetch pool addresses here
        setPools([]);

      } catch (err) {
        console.error('Error fetching pools:', err);
        setError('Failed to load pools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPools();
  }, [poolsLength, isLoadingLength]);

  // Filter pools by token
  const filterPoolsByToken = (tokenAddress: `0x${string}`) => {
    return pools.filter(pool =>
      pool.token0.toLowerCase() === tokenAddress.toLowerCase() ||
      pool.token1.toLowerCase() === tokenAddress.toLowerCase()
    );
  };

  // Filter YRT pools only
  const getYRTPools = () => {
    return pools.filter(pool => pool.isYRTPool);
  };

  // Filter pools by property name
  const filterPoolsByProperty = (propertyName: string) => {
    return pools.filter(pool =>
      pool.propertyName?.toLowerCase().includes(propertyName.toLowerCase())
    );
  };

  // Get pools by token pair
  const getPoolByTokenPair = (tokenA: `0x${string}`, tokenB: `0x${string}`) => {
    return pools.find(pool =>
      (pool.token0.toLowerCase() === tokenA.toLowerCase() && pool.token1.toLowerCase() === tokenB.toLowerCase()) ||
      (pool.token0.toLowerCase() === tokenB.toLowerCase() && pool.token1.toLowerCase() === tokenA.toLowerCase())
    );
  };

  // Get available tokens for swap
  const getAvailableTokens = () => {
    const tokens = new Map();

    pools.forEach(pool => {
      tokens.set(pool.token0.toLowerCase(), {
        address: pool.token0,
        symbol: pool.token0Symbol,
        name: pool.token0Name,
        isYRT: pool.isYRTPool && pool.token0Symbol.includes('YRT'),
      });

      tokens.set(pool.token1.toLowerCase(), {
        address: pool.token1,
        symbol: pool.token1Symbol,
        name: pool.token1Name,
        isYRT: pool.isYRTPool && pool.token1Symbol.includes('YRT'),
      });
    });

    return Array.from(tokens.values());
  };

  return {
    pools,
    isLoading: isLoading || isLoadingLength,
    error,
    poolCount: pools.length,

    // Filter functions
    filterPoolsByToken,
    getYRTPools,
    filterPoolsByProperty,
    getPoolByTokenPair,
    getAvailableTokens,
  };
}
