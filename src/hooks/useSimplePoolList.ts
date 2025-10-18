import { useReadContract, usePublicClient } from 'wagmi';
import { useState, useEffect } from 'react';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';

export function useSimplePoolList() {
  const publicClient = usePublicClient();

  // Get the total number of pools from the factory
  const factoryLength = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPoolsLength',
    query: {
      enabled: true,
    },
  });

  const [pools, setPools] = useState<`0x${string}`[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchPools() {
      if (!factoryLength.data || Number(factoryLength.data) === 0 || !publicClient) {
        setPools([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsError(false);

        const maxPools = Number(factoryLength.data);
        // Limit to 50 pools for performance reasons
        const poolsToFetch = Math.min(maxPools, 50);

        // Use multicall to fetch all pools at once
        const poolContracts = Array.from({ length: poolsToFetch }, (_, i) => ({
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

    if (factoryLength.data !== undefined && !factoryLength.isLoading) {
      fetchPools();
    }
  }, [factoryLength.data, factoryLength.isLoading, publicClient]);

  return {
    pools,
    isLoading: isLoading || factoryLength.isLoading,
    isError: isError || factoryLength.isError,
    totalPools: factoryLength.data ? Number(factoryLength.data) : 0,
  };
}