import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { YRT_TOKEN_ABI } from '@/constants/abis/YRT_TOKEN_ABI';
import { formatAmount } from '@coinbase/onchainkit/token';
import { calculateYieldAmount, formatSnapshotBalance, formatSnapshotPercentage } from './useYRTSnapshot';

export interface YieldDistribution {
  seriesId: number;
  periodId: number;
  totalYield: string;
  totalYieldWei: bigint;
  yieldClaimed: string;
  yieldClaimedWei: bigint;
  remainingYield: string;
  remainingYieldWei: bigint;
  distributionProgress: number;
  isActive: boolean;
  isMatured: boolean;
  snapshotTaken: boolean;
  holdersCount: number;
}

export interface UserYieldInfo {
  seriesId: number;
  periodId: number;
  userBalance: string;
  userBalanceWei: bigint;
  userYieldAmount: string;
  userYieldWei: bigint;
  hasClaimed: boolean;
  isEligible: boolean;
  userPercentage: number;
  claimStatus: 'pending' | 'available' | 'claimed' | 'ineligible';
  totalSupplyWei: bigint;
}

export interface DistributionStats {
  totalDistributions: number;
  totalYieldDistributed: string;
  totalYieldDistributedWei: bigint;
  totalYieldDeposited: string;
  totalYieldDepositedWei: bigint;
  averageYieldPerPeriod: string;
  averageYieldPerPeriodWei: bigint;
  userTotalClaimable: string;
  userTotalClaimableWei: bigint;
  userTotalClaimed: string;
  userTotalClaimedWei: bigint;
}

// Hook to get yield distribution info for a specific period
export function useYieldDistributionInfo(seriesId: bigint | number, periodId: bigint | number) {
  const { data: periodInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: [BigInt(seriesId), BigInt(periodId)],
    query: {
      enabled: !!seriesId && !!periodId,
    }
  });

  const { data: seriesInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesInfo',
    args: [BigInt(seriesId)],
    query: {
      enabled: !!seriesId,
    }
  });

  const now = BigInt(Math.floor(Date.now() / 1000));

  // Safely access periodInfo properties with type assertions
  const periodInfoObj = periodInfo as any;
  const maturityDate = periodInfoObj?.maturityDate ? BigInt(periodInfoObj.maturityDate) : BigInt(0);
  const isActive = periodInfoObj?.isActive || false;
  const totalYieldWei = periodInfoObj?.totalYield ? BigInt(periodInfoObj.totalYield) : BigInt(0);
  const yieldClaimedWei = periodInfoObj?.yieldClaimed ? BigInt(periodInfoObj.yieldClaimed) : BigInt(0);

  const isMatured = maturityDate > BigInt(0) ? now >= maturityDate : false;
  const remainingYieldWei = totalYieldWei - yieldClaimedWei;
  const distributionProgress = totalYieldWei > BigInt(0) ? Number((yieldClaimedWei * BigInt(10000)) / totalYieldWei) / 100 : 0;
  const snapshotTaken = isMatured; // Simplified logic - assume snapshot is taken when matured

  const formattedData: YieldDistribution | null = periodInfo ? {
    seriesId: Number(seriesId),
    periodId: Number(periodId),
    totalYield: formatSnapshotBalance(totalYieldWei),
    totalYieldWei,
    yieldClaimed: formatSnapshotBalance(yieldClaimedWei),
    yieldClaimedWei,
    remainingYield: formatSnapshotBalance(remainingYieldWei),
    remainingYieldWei,
    distributionProgress,
    isActive: Boolean(isActive),
    isMatured,
    snapshotTaken,
    holdersCount: 0, // Simplified for now
  } : null;

  return {
    periodInfo,
    seriesInfo,
    snapshotTaken,
    isMatured,
    totalYieldWei,
    yieldClaimedWei,
    remainingYieldWei,
    distributionProgress,
    formattedData,
  };
}

// Hook to get user's yield info for a specific period
export function useUserYieldInfo(seriesId: bigint | number, periodId: bigint | number, userAddress: `0x${string}`) {
  const { data: userBalance } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'hasUserClaimedYieldForPeriod',
    args: [BigInt(seriesId), BigInt(periodId), userAddress],
    query: {
      enabled: !!seriesId && !!periodId && !!userAddress,
    }
  });

  const { data: seriesInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesInfo',
    args: [BigInt(seriesId)],
    query: {
      enabled: !!seriesId,
    }
  });

  const { data: periodInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: [BigInt(seriesId), BigInt(periodId)],
    query: {
      enabled: !!seriesId && !!periodId,
    }
  });

  // Simplified - use balanceOf and totalSupply for now (not snapshot-specific)
  const { data: currentUserBalance } = useReadContract({
    address: seriesInfo && typeof seriesInfo === 'object' && 'tokenAddress' in seriesInfo
      ? (seriesInfo.tokenAddress as `0x${string}`)
      : undefined,
    abi: YRT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
    query: {
      enabled: !!seriesInfo && typeof seriesInfo === 'object' && 'tokenAddress' in seriesInfo && !!userAddress,
    }
  });

  const { data: totalSupply } = useReadContract({
    address: seriesInfo && typeof seriesInfo === 'object' && 'tokenAddress' in seriesInfo
      ? (seriesInfo.tokenAddress as `0x${string}`)
      : undefined,
    abi: YRT_TOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!seriesInfo && typeof seriesInfo === 'object' && 'tokenAddress' in seriesInfo,
    }
  });

  // Calculate user's yield amount
  const userBalanceWei = currentUserBalance as bigint || BigInt(0);
  const totalSupplyWei = totalSupply as bigint || BigInt(0);

  // Safely access periodInfo properties
  const periodInfoObj2 = periodInfo as any;
  const maturityDate2 = periodInfoObj2?.maturityDate ? BigInt(periodInfoObj2.maturityDate) : BigInt(0);
  const totalYieldWei = periodInfoObj2?.totalYield ? BigInt(periodInfoObj2.totalYield) : BigInt(0);
  const isMatured = maturityDate2 > BigInt(0) ? BigInt(Math.floor(Date.now() / 1000)) >= maturityDate2 : false;

  const userYieldWei = calculateYieldAmount(userBalanceWei, totalYieldWei, totalSupplyWei);
  const userPercentage = totalSupplyWei > BigInt(0) ? Number((userBalanceWei * BigInt(10000)) / totalSupplyWei) / 100 : 0;
  const hasClaimed = false; // Simplified - actual claiming logic would be more complex
  const isEligible = userBalanceWei > BigInt(0) && totalYieldWei > BigInt(0);

  // Simplified claim status
  const claimStatus: 'pending' | 'available' | 'claimed' | 'ineligible' = isEligible
    ? (isMatured ? 'available' : 'pending')
    : 'ineligible';

  const formattedData: UserYieldInfo | null = periodInfo ? {
    seriesId: Number(seriesId),
    periodId: Number(periodId),
    userBalance: formatSnapshotBalance(userBalanceWei),
    userBalanceWei,
    userYieldAmount: formatSnapshotBalance(userYieldWei),
    userYieldWei,
    hasClaimed,
    isEligible,
    userPercentage,
    claimStatus,
    totalSupplyWei,
  } : null;

  return {
    userBalance: userBalanceWei,
    userYieldAmount: userYieldWei,
    hasClaimed,
    isEligible,
    userPercentage,
    claimStatus,
    formattedData,
  };
}

// Hook to get yield distribution history for a series
export function useYieldDistributionHistory(seriesId: bigint | number, maxPeriods: number = 10) {
  const periods: (bigint | number)[] = [];
  for (let i = 1; i <= maxPeriods; i++) {
    periods.push(i);
  }

  const distributionData = periods.map((periodId) => {
    return useYieldDistributionInfo(seriesId, periodId);
  });

  const isLoading = distributionData.some(data => !data.formattedData);
  const formattedHistory = distributionData.map(data => data.formattedData).filter(Boolean) as YieldDistribution[];

  // Calculate stats
  const totalDistributions = formattedHistory.length;
  const totalYieldDistributedWei = formattedHistory.reduce((sum, dist) => sum + dist.yieldClaimedWei, BigInt(0));
  const totalYieldDepositedWei = formattedHistory.reduce((sum, dist) => sum + dist.totalYieldWei, BigInt(0));
  const averageYieldPerPeriodWei = totalDistributions > 0 ? totalYieldDepositedWei / BigInt(totalDistributions) : BigInt(0);

  return {
    history: formattedHistory,
    totalDistributions,
    totalYieldDistributed: formatSnapshotBalance(totalYieldDistributedWei),
    totalYieldDistributedWei,
    totalYieldDeposited: formatSnapshotBalance(totalYieldDepositedWei),
    totalYieldDepositedWei,
    averageYieldPerPeriod: formatSnapshotBalance(averageYieldPerPeriodWei),
    averageYieldPerPeriodWei,
    isLoading,
  };
}

// Hook to get user's yield history across all series/periods
export function useUserYieldHistory(seriesIds: (bigint | number)[], userAddress: `0x${string}`, maxPeriodsPerSeries: number = 10) {
  const allYieldData: UserYieldInfo[] = [];

  seriesIds.forEach((seriesId) => {
    for (let periodId = 1; periodId <= maxPeriodsPerSeries; periodId++) {
      const { formattedData } = useUserYieldInfo(seriesId, periodId, userAddress);
      if (formattedData) {
        allYieldData.push(formattedData);
      }
    }
  });

  const eligiblePeriods = allYieldData.filter(data => data.isEligible);
  const claimedPeriods = allYieldData.filter(data => data.hasClaimed);
  const availablePeriods = allYieldData.filter(data => data.claimStatus === 'available');

  const userTotalClaimableWei = availablePeriods.reduce((sum, data) => sum + data.userYieldWei, BigInt(0));
  const userTotalClaimedWei = claimedPeriods.reduce((sum, data) => sum + data.userYieldWei, BigInt(0));

  return {
    history: allYieldData,
    eligiblePeriods: eligiblePeriods.length,
    claimedPeriods: claimedPeriods.length,
    availablePeriods: availablePeriods.length,
    userTotalClaimable: formatSnapshotBalance(userTotalClaimableWei),
    userTotalClaimableWei,
    userTotalClaimed: formatSnapshotBalance(userTotalClaimedWei),
    userTotalClaimedWei,
  };
}

// Hook to get comprehensive yield statistics
export function useYieldStatistics(seriesIds: (bigint | number)[], userAddress: `0x${string}`) {
  const allStats = seriesIds.map((seriesId) => {
    return useYieldDistributionHistory(seriesId, 10);
  });

  const totalDistributions = allStats.reduce((sum, stat) => sum + stat.totalDistributions, 0);
  const totalYieldDistributedWei = allStats.reduce((sum, stat) => sum + stat.totalYieldDistributedWei, BigInt(0));
  const totalYieldDepositedWei = allStats.reduce((sum, stat) => sum + stat.totalYieldDepositedWei, BigInt(0));
  const averageYieldPerPeriodWei = totalDistributions > 0 ? totalYieldDepositedWei / BigInt(totalDistributions) : BigInt(0);

  const userHistory = useUserYieldHistory(seriesIds, userAddress, 10);

  const stats: DistributionStats = {
    totalDistributions,
    totalYieldDistributed: formatSnapshotBalance(totalYieldDistributedWei),
    totalYieldDistributedWei,
    totalYieldDeposited: formatSnapshotBalance(totalYieldDepositedWei),
    totalYieldDepositedWei,
    averageYieldPerPeriod: formatSnapshotBalance(averageYieldPerPeriodWei),
    averageYieldPerPeriodWei,
    userTotalClaimable: userHistory.userTotalClaimable,
    userTotalClaimableWei: userHistory.userTotalClaimableWei,
    userTotalClaimed: userHistory.userTotalClaimed,
    userTotalClaimedWei: userHistory.userTotalClaimedWei,
  };

  return {
    stats,
    isLoading: allStats.some(stat => stat.isLoading),
  };
}

// Hook to track real-time yield distribution updates
export function useYieldDistributionTracker(seriesId: bigint | number, periodId: bigint | number) {
  const { data: periodInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: [BigInt(seriesId), BigInt(periodId)],
    query: {
      enabled: !!seriesId && !!periodId,
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  });

  const { data: totalYieldDeposited } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: [BigInt(seriesId), BigInt(periodId)],
    query: {
      enabled: !!seriesId && !!periodId,
      refetchInterval: 5000,
    }
  });

  // Safely access periodInfo properties
  const periodInfoObj3 = periodInfo as any;
  const totalYieldWei = periodInfoObj3?.totalYield ? BigInt(periodInfoObj3.totalYield) : BigInt(0);
  const yieldClaimedWei = periodInfoObj3?.yieldClaimed ? BigInt(periodInfoObj3.yieldClaimed) : BigInt(0);
  const remainingYieldWei = totalYieldWei - yieldClaimedWei;
  const distributionProgress = totalYieldWei > BigInt(0) ? Number((yieldClaimedWei * BigInt(10000)) / totalYieldWei) / 100 : 0;

  return {
    totalYield: formatSnapshotBalance(totalYieldWei),
    totalYieldWei,
    yieldClaimed: formatSnapshotBalance(yieldClaimedWei),
    yieldClaimedWei,
    remainingYield: formatSnapshotBalance(remainingYieldWei),
    remainingYieldWei,
    distributionProgress,
    isLoading: !periodInfo,
  };
}

// Utility functions for yield calculations
export const calculateAPY = (totalYield: bigint, principal: bigint, periodDays: number): number => {
  if (principal === BigInt(0) || periodDays === 0) return 0;
  const annualYield = (totalYield * BigInt(365)) / BigInt(periodDays);
  return Number((annualYield * BigInt(10000)) / principal) / 100; // 2 decimal places
};

export const calculateUserAPY = (userYield: bigint, userBalance: bigint, periodDays: number): number => {
  return calculateAPY(userYield, userBalance, periodDays);
};

export const formatYieldAmount = (amount: bigint, decimals: number = 18): string => {
  return formatSnapshotBalance(amount, decimals);
};

export const formatYieldPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

export const getClaimStatusColor = (status: string): string => {
  switch (status) {
    case 'available': return 'text-green-400';
    case 'claimed': return 'text-blue-400';
    case 'pending': return 'text-yellow-400';
    case 'ineligible': return 'text-gray-400';
    default: return 'text-gray-400';
  }
};

export const getClaimStatusLabel = (status: string): string => {
  switch (status) {
    case 'available': return 'Ready to Claim';
    case 'claimed': return 'Claimed';
    case 'pending': return 'Pending';
    case 'ineligible': return 'Not Eligible';
    default: return 'Unknown';
  }
};

export default {
  useYieldDistributionInfo,
  useUserYieldInfo,
  useYieldDistributionHistory,
  useUserYieldHistory,
  useYieldStatistics,
  useYieldDistributionTracker,
  calculateAPY,
  calculateUserAPY,
  formatYieldAmount,
  formatYieldPercentage,
  getClaimStatusColor,
  getClaimStatusLabel,
};