import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { formatAmount } from '@coinbase/onchainkit/token';

export interface PeriodInfo {
  maturityDate: bigint;
  startedAt: bigint;
  totalYield: bigint;
  yieldClaimed: bigint;
  isActive: boolean;
}

export interface FormattedPeriodInfo {
  maturityDate: bigint;
  startedAt: bigint;
  totalYield: bigint;
  yieldClaimed: bigint;
  isActive: boolean;
  formattedMaturityDate: string;
  formattedStartedAt: string;
  formattedTotalYield: string;
  formattedYieldClaimed: string;
  yieldProgress: number; // percentage
  timeRemaining: number; // days remaining
  isMatured: boolean;
}

// Utility functions for formatting period data using OnchainKit
const formatTokenAmount = (amount: bigint | string, decimals: number = 18): string => {
  const amountStr = typeof amount === 'bigint' ? amount.toString() : amount;
  return formatAmount(String(Number(amountStr) / Math.pow(10, decimals)));
};

const formatDate = (timestamp: bigint | number): string => {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toLocaleDateString();
};

const calculateTimeRemaining = (maturityDate: bigint): number => {
  const now = Math.floor(Date.now() / 1000);
  const maturity = Number(maturityDate);
  const remaining = Math.max(0, maturity - now);
  return Math.ceil(remaining / (24 * 60 * 60)); // days
};

const calculateYieldProgress = (totalYield: bigint, yieldClaimed: bigint): number => {
  if (totalYield === BigInt(0)) return 0;
  return Number((yieldClaimed * BigInt(100)) / totalYield);
};

const formatPeriodInfo = (info: PeriodInfo): FormattedPeriodInfo | null => {
  if (!info) return null;

  return {
    ...info,
    formattedMaturityDate: formatDate(info.maturityDate),
    formattedStartedAt: formatDate(info.startedAt),
    formattedTotalYield: formatTokenAmount(info.totalYield),
    formattedYieldClaimed: formatTokenAmount(info.yieldClaimed),
    yieldProgress: calculateYieldProgress(info.totalYield, info.yieldClaimed),
    timeRemaining: calculateTimeRemaining(info.maturityDate),
    isMatured: Number(info.maturityDate) <= Math.floor(Date.now() / 1000),
  };
};

export function usePeriodInfo(seriesId: bigint | number, periodId: bigint | number) {
  return useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: [BigInt(seriesId), BigInt(periodId)],
    query: {
      enabled: !!seriesId && !!periodId,
    }
  });
}

export function useAllPeriodsInfo(seriesId: bigint | number) {
  // This would require a batch call or multiple calls to get all periods for a series
  // For now, we'll return a hook that can be used with specific period IDs
  const getPeriodInfo = (periodId: bigint | number) => {
    return usePeriodInfo(seriesId, periodId);
  };

  return {
    getPeriodInfo,
    // You could add more sophisticated batch querying here
  };
}

export function useUserYieldClaimStatus(
  seriesId: bigint | number,
  periodId: bigint | number,
  userAddress: `0x${string}`
) {
  return useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'hasUserClaimedYieldForPeriod',
    args: [BigInt(seriesId), BigInt(periodId), userAddress],
    query: {
      enabled: !!seriesId && !!periodId && !!userAddress,
    }
  });
}

// Hook to get token price for a series
export function useSeriesTokenPrice(seriesId: bigint | number) {
  return useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'tokenPrice',
    args: [BigInt(seriesId)],
    query: {
      enabled: !!seriesId,
    }
  });
}

// Hook to check if direct buy is enabled for a series
export function useDirectBuyEnabled(seriesId: bigint | number) {
  return useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'directBuyEnabled',
    args: [BigInt(seriesId)],
    query: {
      enabled: !!seriesId,
    }
  });
}

// Hook to get total tokens sold for a series
export function useTotalTokensSold(seriesId: bigint | number) {
  return useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'totalTokensSold',
    args: [BigInt(seriesId)],
    query: {
      enabled: !!seriesId,
    }
  });
}

export default {
  usePeriodInfo,
  useAllPeriodsInfo,
  useUserYieldClaimStatus,
  useSeriesTokenPrice,
  useDirectBuyEnabled,
  useTotalTokensSold,
  // Utilities
  formatTokenAmount,
  formatDate,
  formatPeriodInfo,
  calculateTimeRemaining,
  calculateYieldProgress,
};