import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';

export function useSimplePoolList() {
  // Get the total number of pools from the factory
  const factoryLength = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPoolsLength',
    query: {
      enabled: true,
    },
  });

  // Create an array to hold all pool queries
  const poolQueries = [];
  const maxPools = factoryLength.data ? Number(factoryLength.data) : 0;

  // Dynamically create queries for all pools (up to 50 for performance reasons)
  const poolsToFetch = Math.min(maxPools, 50);

  for (let i = 0; i < poolsToFetch; i++) {
    const poolQuery = useReadContract({
      address: CONTRACTS.DEX_FACTORY as `0x${string}`,
      abi: DEX_FACTORY_ABI,
      functionName: 'allPools',
      args: [BigInt(i)],
      query: {
        enabled: factoryLength.data !== undefined && factoryLength.data !== null && i < Number(factoryLength.data),
      },
    });
    poolQueries.push(poolQuery);
  }

  const pools = poolQueries
    .filter(query => query.data !== undefined && query.data !== null)
    .map(query => query.data as `0x${string}`);

  const isLoading = poolQueries.some(query => query.isLoading) || factoryLength.isLoading;
  const isError = poolQueries.some(query => query.isError) || factoryLength.isError;

  return {
    pools,
    isLoading,
    isError,
    totalPools: maxPools,
  };
}