import { useState, useEffect } from 'react';
import { useDEX, PoolInfo } from './useDEX';
import { useYRTSeries } from './useYRTSeries';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { formatUnits } from 'viem';

export function useAllPools() {
  const {
    allPoolsLength,
    useAllPools,
    usePoolInfo,
    usePoolTokens,
    usePoolMetadata,
    useTokenInfo,
    useIsYRTToken
  } = useDEX();
  const { useSeriesInfoWithSlug } = useYRTSeries();

  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllPools = async () => {
      if (!allPoolsLength) return;

      setIsLoading(true);
      setError(null);

      try {
        const poolCount = Number(allPoolsLength);
        const poolsData: PoolInfo[] = [];

        for (let i = 0; i < poolCount; i++) {
          try {
            // Get pool address
            const { data: poolAddress } = useAllPools(i);

            if (!poolAddress || poolAddress === '0x0000000000000000000000000000000000000000') {
              continue;
            }

            // Get pool tokens
            const poolTokens = usePoolTokens(poolAddress as `0x${string}`);
            const token0 = poolTokens.token0.data;
            const token1 = poolTokens.token1.data;

            if (!token0 || !token1) continue;

            // Get pool info (reserves)
            const poolInfoResult = usePoolInfo(poolAddress as `0x${string}`);
            const reserves = poolInfoResult.data;

            const poolMeta = usePoolMetadata(poolAddress as `0x${string}`);
            const metadata = {
              propertyName: poolMeta.propertyName.data,
              swapFee: poolMeta.swapFee.data,
              totalSupply: poolMeta.totalSupply.data,
            };

            // Get token info
            const token0InfoResult = useTokenInfo(token0 as `0x${string}`);
            const token1InfoResult = useTokenInfo(token1 as `0x${string}`);
            const token0Info = {
              name: token0InfoResult.name.data,
              symbol: token0InfoResult.symbol.data,
              decimals: token0InfoResult.decimals.data,
            };
            const token1Info = {
              name: token1InfoResult.name.data,
              symbol: token1InfoResult.symbol.data,
              decimals: token1InfoResult.decimals.data,
            };

            // Check if any token is YRT
            const token0YRT = useIsYRTToken(token0 as `0x${string}`);
            const token1YRT = useIsYRTToken(token1 as `0x${string}`);
            const isToken0YRT = token0YRT.data;
            const isToken1YRT = token1YRT.data;

            const isYRTPool = !!isToken0YRT || !!isToken1YRT;

            // Get YRT series info if applicable
            let yrtSeriesInfo = null;
            let propertyName = metadata?.propertyName || '';

            if (isYRTPool) {
              const yrtTokenAddress = isToken0YRT ? token0 : token1;
              const yrtSeriesId = isToken0YRT ? isToken0YRT : isToken1YRT;

              if (yrtSeriesId && yrtSeriesId > 0) {
                const seriesInfoResult = useSeriesInfoWithSlug(Number(yrtSeriesId));
                const seriesInfo = seriesInfoResult.data;
                yrtSeriesInfo = seriesInfo;
                propertyName = (seriesInfo as any)?.info?.propertyName || propertyName;
              }
            }

            // Format reserves
            const reserve0 = reserves && Array.isArray(reserves) ? formatUnits(reserves[0], 18) : '0';
            const reserve1 = reserves && Array.isArray(reserves) ? formatUnits(reserves[1], 18) : '0';

            // Determine which token is which (YRT should be token0 in display)
            let displayToken0 = token0 as `0x${string}`;
            let displayToken1 = token1 as `0x${string}`;
            let displayToken0Symbol = token0Info?.symbol || 'Unknown';
            let displayToken1Symbol = token1Info?.symbol || 'Unknown';
            let displayToken0Name = token0Info?.name;
            let displayToken1Name = token1Info?.name;

            // If token1 is YRT, swap them for consistent display
            if (isToken1YRT) {
              displayToken0 = token1 as `0x${string}`;
              displayToken1 = token0 as `0x${string}`;
              displayToken0Symbol = token1Info?.symbol || 'Unknown';
              displayToken1Symbol = token0Info?.symbol || 'Unknown';
              displayToken0Name = token1Info?.name;
              displayToken1Name = token0Info?.name;
            }

            const poolInfo: PoolInfo = {
              address: poolAddress as `0x${string}`,
              token0: displayToken0,
              token1: displayToken1,
              token0Symbol: displayToken0Symbol,
              token1Symbol: displayToken1Symbol,
              token0Name: displayToken0Name,
              token1Name: displayToken1Name,
              reserve0: parseFloat(reserve0).toFixed(6),
              reserve1: parseFloat(reserve1).toFixed(6),
              propertyName: (propertyName as string) || '',
              swapFee: metadata?.swapFee ? ((Number(metadata.swapFee) / 100) * 0.1).toFixed(2) : '0.30', // Convert basis points to percentage
              totalSupply: metadata?.totalSupply ? formatUnits(metadata.totalSupply as bigint, 18) : '0',
              isYRTPool,
            };

            poolsData.push(poolInfo);
          } catch (poolError) {
            console.error(`Error loading pool ${i}:`, poolError);
            continue;
          }
        }

        setPools(poolsData);
      } catch (err) {
        console.error('Error loading pools:', err);
        setError('Failed to load pools');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllPools();
  }, [allPoolsLength]);

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