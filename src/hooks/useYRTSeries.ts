import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';

export interface SeriesInfo {
  tokenAddress: `0x${string}`;
  underlyingToken: `0x${string}`;
  seriesAdmin: `0x${string}`;
  propertyName: string;
  createdAt: bigint;
  initialSupply: bigint;
  isActive: boolean;
}

export interface SeriesWithSlug {
  info: SeriesInfo;
  slug: string;
}

export function useYRTSeries() {
  // Get all series IDs
  const {
    data: allSeriesIds,
    isLoading: isLoadingIds,
    error: idsError
  } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'getAllSeriesIds',
  });

  // Get series info for a specific series ID
  const useSeriesInfo = (seriesId: bigint | number) => {
    return useReadContract({
      address: CONTRACTS.YRT_FACTORY,
      abi: YRT_FACTORY_ABI,
      functionName: 'seriesInfo',
      args: [BigInt(seriesId)],
    });
  };

  // Get series slug for a specific series ID
  const useSeriesSlug = (seriesId: bigint | number) => {
    return useReadContract({
      address: CONTRACTS.YRT_FACTORY,
      abi: YRT_FACTORY_ABI,
      functionName: 'seriesSlug',
      args: [BigInt(seriesId)],
    });
  };

  // Get series ID by slug
  const useSeriesIdBySlug = (slug: string) => {
    return useReadContract({
      address: CONTRACTS.YRT_FACTORY,
      abi: YRT_FACTORY_ABI,
      functionName: 'getSeriesIdBySlug',
      args: [slug],
    });
  };

  // Get series ID by token address
  const useSeriesIdByToken = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.YRT_FACTORY,
      abi: YRT_FACTORY_ABI,
      functionName: 'getSeriesIdByToken',
      args: [tokenAddress],
    });
  };

  // Get complete series info with slug
  const useSeriesInfoWithSlug = (seriesId: bigint | number) => {
    return useReadContract({
      address: CONTRACTS.YRT_FACTORY,
      abi: YRT_FACTORY_ABI,
      functionName: 'getSeriesInfoWithSlug',
      args: [BigInt(seriesId)],
    });
  };

  // Utility function to convert slug to series ID (client-side)
  const slugToSeriesId = (slug: string): number => {
    // Parse slug format: SYMBOL-XX (e.g., "OWF-01" -> 1)
    const parts = slug.split('-');
    if (parts.length !== 2) return 0;

    const seriesId = parseInt(parts[1], 10);
    return isNaN(seriesId) ? 0 : seriesId;
  };

  // Utility function to format series ID to slug (client-side)
  const seriesIdToSlug = (seriesId: number, symbol: string): string => {
    // Format: SYMBOL-XX (e.g., 1 + "OWF" -> "OWF-01")
    const formattedId = seriesId.toString().padStart(2, '0');
    return `${symbol}-${formattedId}`;
  };

  // Utility function to validate slug format
  const isValidSlug = (slug: string): boolean => {
    // Check format: SYMBOL-XX (e.g., "OWF-01")
    const slugRegex = /^[A-Z]+-\d{2}$/;
    return slugRegex.test(slug);
  };

  // Utility function to extract symbol from slug
  const extractSymbolFromSlug = (slug: string): string => {
    const parts = slug.split('-');
    return parts.length >= 2 ? parts[0] : '';
  };

  // Utility function to get token symbol from slug
  const getTokenSymbolFromSlug = (slug: string): string => {
    return extractSymbolFromSlug(slug);
  };

  return {
    // Queries
    allSeriesIds,
    isLoadingIds,
    idsError,

    // Hooks
    useSeriesInfo,
    useSeriesSlug,
    useSeriesIdBySlug,
    useSeriesIdByToken,
    useSeriesInfoWithSlug,

    // Utilities
    slugToSeriesId,
    seriesIdToSlug,
    isValidSlug,
    extractSymbolFromSlug,
    getTokenSymbolFromSlug,
  };
}