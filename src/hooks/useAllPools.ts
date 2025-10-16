import { useState, useEffect } from 'react';
import { PoolInfo } from './useDEX';

// Mock data untuk testing UI development
const MOCK_POOLS: PoolInfo[] = [
  {
    address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
    token0: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as `0x${string}`,
    token1: "0x1111111111111111111111111111111111111111" as `0x${string}`,
    token0Symbol: "USDC",
    token1Symbol: "IDRX",
    token0Name: "USD Coin",
    token1Name: "Indonesian Rupiah Token",
    reserve0: "10000.000000",
    reserve1: "150000000.000000",
    propertyName: "Property A - Jakarta",
    swapFee: "0.30",
    totalSupply: "1500.000000",
    isYRTPool: false,
  },
  {
    address: "0x2345678901234567890123456789012345678901" as `0x${string}`,
    token0: "0xfedcbafedcbafedcbafedcbafedcbafedcbafed" as `0x${string}`,
    token1: "0x2222222222222222222222222222222222222222" as `0x${string}`,
    token0Symbol: "YRT-PROP1",
    token1Symbol: "USDC",
    token0Name: "Yield Receipt Token - Property 1",
    token1Name: "USD Coin",
    reserve0: "5000.000000",
    reserve1: "75000.000000",
    propertyName: "Property 1 - Surabaya",
    swapFee: "0.30",
    totalSupply: "2500.000000",
    isYRTPool: true,
  },
  {
    address: "0x3456789012345678901234567890123456789012" as `0x${string}`,
    token0: "0x3333333333333333333333333333333333333333" as `0x${string}`,
    token1: "0x4444444444444444444444444444444444444444" as `0x${string}`,
    token0Symbol: "YRT-PROP2",
    token1Symbol: "USDT",
    token0Name: "Yield Receipt Token - Property 2",
    token1Name: "Tether USD",
    reserve0: "8000.000000",
    reserve1: "120000.000000",
    propertyName: "Property 2 - Bali",
    swapFee: "0.30",
    totalSupply: "3200.000000",
    isYRTPool: true,
  }
];

export function useAllPools() {
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulasi loading untuk UI testing
    setIsLoading(true);
    setError(null);

    // Simulasi delay async
    const timer = setTimeout(() => {
      try {
        // Untuk development, gunakan mock data
        console.log('useAllPools: Using mock data for development');
        setPools(MOCK_POOLS);
      } catch (err) {
        console.error('useAllPools Error:', err);
        setError('Failed to load pools');
      } finally {
        setIsLoading(false);
      }
    }, 1000); // 1 detik delay untuk simulasi loading

    return () => clearTimeout(timer);
  }, []); // Empty dependency array untuk menghindari infinite loop

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
      pool.propertyName.toLowerCase().includes(propertyName.toLowerCase())
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
    isLoading,
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