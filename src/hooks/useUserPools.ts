import { useState, useEffect } from 'react';
import { useReadContract, useReadContracts, useAccount, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';
import { OWNA_POOL_ABI } from '@/constants/abis/OWNA_POOL_ABI';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';

export interface UserPoolData {
  // Pool identifiers
  poolAddress: `0x${string}`;

  // Token addresses
  token0: `0x${string}`;
  token1: `0x${string}`;

  // Token info
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;

  // Pool data
  propertyName: string;
  propertyOwner: `0x${string}`;
  reserve0: bigint;
  reserve1: bigint;
  totalSupply: bigint;
  swapFee: bigint;

  // Calculated values
  tvl: string;
  price: string;

  // YRT Series info (if token0 is YRT)
  seriesId?: bigint;
  isYRTPool: boolean;
}

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

/**
 * Hook to fetch all pools owned by the currently logged-in user
 * Filters pools where propertyOwner matches the connected address
 */
export function useUserPools() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [pools, setPools] = useState<UserPoolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Get total number of pools
  const { data: poolsLength, isLoading: isLoadingLength } = useReadContract({
    address: CONTRACTS.DEX_FACTORY,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPoolsLength',
    query: {
      refetchInterval: 10000,
    }
  });

  useEffect(() => {
    if (!address || !publicClient) {
      setPools([]);
      setIsLoading(false);
      return;
    }

    async function fetchUserPools() {
      if (!publicClient || !address) return;

      try {
        setIsLoading(true);
        setError(null);

        if (!poolsLength || Number(poolsLength) === 0) {
          setPools([]);
          setIsLoading(false);
          return;
        }

        const totalPools = Number(poolsLength);

        // Step 2: Batch fetch all pool addresses using multicall
        const poolAddressContracts = Array.from({ length: totalPools }, (_, i) => ({
          address: CONTRACTS.DEX_FACTORY,
          abi: DEX_FACTORY_ABI,
          functionName: 'allPools' as const,
          args: [BigInt(i)],
        }));

        const poolAddressResults = await publicClient.multicall({
          contracts: poolAddressContracts as any,
          allowFailure: true,
        });

        const poolAddresses = poolAddressResults
          .filter((result): result is { status: 'success'; result: `0x${string}` } =>
            result.status === 'success' && typeof result.result === 'string'
          )
          .map(result => result.result);

        if (poolAddresses.length === 0) {
          setPools([]);
          setIsLoading(false);
          return;
        }

        // Step 3: For each pool, fetch basic info (propertyOwner, tokens, reserves)
        const poolBasicInfoContracts = poolAddresses.flatMap(poolAddr => [
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'propertyOwner' as const,
          },
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'token0' as const,
          },
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'token1' as const,
          },
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'getReserves' as const,
          },
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'propertyName' as const,
          },
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'totalSupply' as const,
          },
          {
            address: poolAddr,
            abi: OWNA_POOL_ABI,
            functionName: 'swapFee' as const,
          },
        ]);

        const basicInfoResults = await publicClient.multicall({
          contracts: poolBasicInfoContracts as any,
          allowFailure: true,
        });

        // Step 4: Parse results and filter by user address
        const userPoolsData: UserPoolData[] = [];

        for (let i = 0; i < poolAddresses.length; i++) {
          const baseIndex = i * 7;
          const poolAddr = poolAddresses[i];

          const propertyOwnerResult = basicInfoResults[baseIndex];
          const token0Result = basicInfoResults[baseIndex + 1];
          const token1Result = basicInfoResults[baseIndex + 2];
          const reservesResult = basicInfoResults[baseIndex + 3];
          const propertyNameResult = basicInfoResults[baseIndex + 4];
          const totalSupplyResult = basicInfoResults[baseIndex + 5];
          const swapFeeResult = basicInfoResults[baseIndex + 6];

          // Check if this pool belongs to the user
          if (propertyOwnerResult.status !== 'success') continue;
          const propertyOwner = propertyOwnerResult.result as `0x${string}`;

          if (propertyOwner.toLowerCase() !== address.toLowerCase()) {
            continue; // Skip pools not owned by user
          }

          // Extract data
          const token0 = token0Result.status === 'success' ? token0Result.result as `0x${string}` : '0x0' as `0x${string}`;
          const token1 = token1Result.status === 'success' ? token1Result.result as `0x${string}` : '0x0' as `0x${string}`;

          const reserves = reservesResult.status === 'success' ? reservesResult.result as readonly [bigint, bigint] : [BigInt(0), BigInt(0)] as const;
          const reserve0 = reserves[0];
          const reserve1 = reserves[1];

          const propertyName = propertyNameResult.status === 'success' ? String(propertyNameResult.result) : 'Unknown Pool';
          const totalSupply = totalSupplyResult.status === 'success' ? totalSupplyResult.result as bigint : BigInt(0);
          const swapFee = swapFeeResult.status === 'success' ? swapFeeResult.result as bigint : BigInt(0);

          // Fetch token symbols and names
          const tokenInfoContracts = [
            { address: token0, abi: ERC20_ABI, functionName: 'symbol' as const },
            { address: token0, abi: ERC20_ABI, functionName: 'name' as const },
            { address: token1, abi: ERC20_ABI, functionName: 'symbol' as const },
            { address: token1, abi: ERC20_ABI, functionName: 'name' as const },
          ];

          const tokenInfoResults = await publicClient.multicall({
            contracts: tokenInfoContracts as any,
            allowFailure: true,
          });

          const token0Symbol = tokenInfoResults[0]?.status === 'success' ? String(tokenInfoResults[0].result) : 'YRT';
          const token0Name = tokenInfoResults[1]?.status === 'success' ? String(tokenInfoResults[1].result) : 'YRT Token';
          const token1Symbol = tokenInfoResults[2]?.status === 'success' ? String(tokenInfoResults[2].result) : 'USDC';
          const token1Name = tokenInfoResults[3]?.status === 'success' ? String(tokenInfoResults[3].result) : 'USD Coin';

          // Check if token0 is a YRT token
          let seriesId: bigint | undefined;
          let isYRTPool = false;

          try {
            const seriesIdResult = await publicClient.readContract({
              address: CONTRACTS.YRT_FACTORY,
              abi: YRT_FACTORY_ABI,
              functionName: 'tokenToSeriesId',
              args: [token0],
            });

            if (seriesIdResult && BigInt(seriesIdResult as bigint) > BigInt(0)) {
              seriesId = BigInt(seriesIdResult as bigint);
              isYRTPool = true;
            }
          } catch {
            // Not a YRT token
          }

          // Calculate TVL and price
          const tvl = (parseFloat(formatUnits(reserve0, 18)) + parseFloat(formatUnits(reserve1, 18))).toFixed(2);
          const price = reserve1 > BigInt(0) ? (parseFloat(formatUnits(reserve0, 18)) / parseFloat(formatUnits(reserve1, 18))).toFixed(6) : '0';

          userPoolsData.push({
            poolAddress: poolAddr,
            token0,
            token1,
            token0Symbol,
            token1Symbol,
            token0Name,
            token1Name,
            propertyName,
            propertyOwner,
            reserve0,
            reserve1,
            totalSupply,
            swapFee,
            tvl,
            price,
            seriesId,
            isYRTPool,
          });
        }

        setPools(userPoolsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pools');
      } finally {
        setIsLoading(false);
      }
    }

    if (poolsLength !== undefined && !isLoadingLength) {
      fetchUserPools();
    }
  }, [address, poolsLength, isLoadingLength, publicClient]);

  return {
    pools,
    isLoading: isLoading || isLoadingLength,
    error,
    poolCount: pools.length,
  };
}
