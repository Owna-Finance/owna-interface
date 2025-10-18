import { useState, useEffect } from 'react';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';

export interface UserOwnedSeriesInfo {
  seriesId: bigint;
  propertyName: string;
  propertyOwner: `0x${string}`;
  tokenAddress: `0x${string}`;
  initialPrice: bigint;
  priceIncrement: bigint;
  maxSupply: bigint;
}

/**
 * Hook to fetch only YRT series owned by the connected wallet
 * Filters series where propertyOwner matches the connected address
 */
export function useUserOwnedSeries() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [ownedSeries, setOwnedSeries] = useState<UserOwnedSeriesInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get total series count
  const { data: totalSeries, isLoading: isLoadingCount } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesCounter',
    query: {
      refetchInterval: 10000,
    }
  });

  useEffect(() => {
    if (!address || !publicClient) {
      setOwnedSeries([]);
      setIsLoading(false);
      return;
    }

    async function fetchUserOwnedSeries() {
      if (!publicClient || !address || !totalSeries) return;

      try {
        setIsLoading(true);
        setError(null);

        const seriesCount = Number(totalSeries);
        if (seriesCount === 0) {
          setOwnedSeries([]);
          setIsLoading(false);
          return;
        }

        // Fetch series info for all series
        const seriesInfoContracts = Array.from({ length: seriesCount }, (_, i) => ({
          address: CONTRACTS.YRT_FACTORY as `0x${string}`,
          abi: YRT_FACTORY_ABI,
          functionName: 'seriesInfo' as const,
          args: [BigInt(i + 1)], // Series IDs start from 1
        }));

        const seriesInfoResults = await publicClient.multicall({
          contracts: seriesInfoContracts as any,
          allowFailure: true,
        });

        // Filter series owned by user
        const userSeries: UserOwnedSeriesInfo[] = [];

        for (let i = 0; i < seriesInfoResults.length; i++) {
          const result = seriesInfoResults[i];

          if (result.status === 'success' && result.result) {
            const seriesInfo = result.result as any;
            const propertyOwner = seriesInfo.propertyOwner as `0x${string}`;

            // Only include series owned by connected wallet
            if (propertyOwner.toLowerCase() === address.toLowerCase()) {
              userSeries.push({
                seriesId: BigInt(i + 1),
                propertyName: String(seriesInfo.propertyName || 'Unknown Property'),
                propertyOwner,
                tokenAddress: seriesInfo.tokenAddress as `0x${string}`,
                initialPrice: BigInt(seriesInfo.initialPrice || 0),
                priceIncrement: BigInt(seriesInfo.priceIncrement || 0),
                maxSupply: BigInt(seriesInfo.maxSupply || 0),
              });
            }
          }
        }

        setOwnedSeries(userSeries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch owned series');
      } finally {
        setIsLoading(false);
      }
    }

    if (totalSeries !== undefined && !isLoadingCount) {
      fetchUserOwnedSeries();
    }
  }, [address, totalSeries, isLoadingCount, publicClient]);

  return {
    ownedSeries,
    isLoading: isLoading || isLoadingCount,
    error,
    seriesCount: ownedSeries.length,
  };
}
