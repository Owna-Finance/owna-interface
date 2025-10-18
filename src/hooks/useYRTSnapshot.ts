import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { YRT_TOKEN_ABI } from '@/constants/abis/YRT_TOKEN_ABI';
import { formatAmount } from '@coinbase/onchainkit/token';

export interface SnapshotInfo {
  periodId: number;
  timestamp: bigint;
  totalSupply: bigint;
  holdersCount: number;
  isTaken: boolean;
  maturityDate: bigint;
}

export interface UserSnapshotBalance {
  periodId: number;
  balance: bigint;
  totalSupply: bigint;
  percentage: number;
  isEligible: boolean;
}

export interface YieldDistributionInfo {
  periodId: number;
  totalYield: bigint;
  yieldClaimed: bigint;
  remainingYield: bigint;
  userYieldAmount: bigint;
  hasClaimed: boolean;
  userPercentage: number;
}

// Hook to trigger snapshot for a period
export function useTriggerSnapshot() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const triggerSnapshot = async (seriesId: bigint | number, periodId: bigint | number) => {
    try {
      return writeContract({
        address: CONTRACTS.YRT_FACTORY as `0x${string}`,
        abi: YRT_FACTORY_ABI,
        functionName: 'triggerSnapshotForPeriod',
        args: [BigInt(seriesId), BigInt(periodId)],
      });
    } catch (error) {
      console.error('Error triggering snapshot:', error);
      throw new Error('Error triggering snapshot. Please ensure the period is matured and has yield.');
    }
  };

  return {
    triggerSnapshot,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}

// Hook to get snapshot information for a specific period
export function useSnapshotInfo(tokenAddress: `0x${string}`, periodId: bigint | number) {
  const { data: snapshotTaken } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'isSnapshotTakenForPeriod' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getSnapshotTotalSupplyForPeriod' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  const { data: snapshotTimestamp } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getSnapshotBalanceForPeriod' as any,
    args: [BigInt(periodId), tokenAddress] as any, // Use contract address to get timestamp
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  const { data: maturityDate } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'isPeriodMatured' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  const { data: snapshotHolders } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getSnapshotHoldersForPeriod' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!tokenAddress && !!periodId && !!snapshotTaken,
    }
  });

  const formattedData: SnapshotInfo | null = snapshotTaken ? {
    periodId: Number(periodId),
    timestamp: snapshotTimestamp as bigint || BigInt(0),
    totalSupply: totalSupply as bigint || BigInt(0),
    holdersCount: Array.isArray(snapshotHolders) ? snapshotHolders.length : 0,
    isTaken: Boolean(snapshotTaken),
    maturityDate: maturityDate as bigint || BigInt(0),
  } : null;

  return {
    snapshotTaken,
    totalSupply,
    snapshotTimestamp,
    maturityDate,
    snapshotHolders,
    formattedData,
  };
}

// Hook to get user's snapshot balance for a period
export function useUserSnapshotBalance(tokenAddress: `0x${string}`, periodId: bigint | number, userAddress: `0x${string}`) {
  const { data: userBalance } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getSnapshotBalanceForPeriod' as any,
    args: [BigInt(periodId), userAddress] as any,
    query: {
      enabled: !!tokenAddress && !!periodId && !!userAddress,
    }
  });

  const { data: totalSupply } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getSnapshotTotalSupplyForPeriod' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  const { data: snapshotTaken } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'isSnapshotTakenForPeriod' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  // Calculate user's percentage of total supply
  const userPercentage = userBalance && totalSupply && BigInt(totalSupply as bigint) > BigInt(0)
    ? Number((BigInt(userBalance as bigint) * BigInt(10000)) / BigInt(totalSupply as bigint)) / 100 // 2 decimal places
    : 0;

  const formattedData: UserSnapshotBalance | null = snapshotTaken ? {
    periodId: Number(periodId),
    balance: userBalance as bigint || BigInt(0),
    totalSupply: totalSupply as bigint || BigInt(0),
    percentage: userPercentage,
    isEligible: Boolean(userBalance && BigInt(userBalance as bigint) > BigInt(0)),
  } : null;

  return {
    userBalance,
    totalSupply,
    snapshotTaken,
    userPercentage,
    formattedData,
  };
}

// Hook to get all current holders of a token
export function useTokenHolders(tokenAddress: `0x${string}`) {
  const { data: holders } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getAllHolders' as any,
    query: {
      enabled: !!tokenAddress,
    }
  });

  const { data: holdersCount } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'getHoldersCount' as any,
    query: {
      enabled: !!tokenAddress,
    }
  });

  return {
    holders: (holders as unknown as `0x${string}`[]) || [],
    holdersCount: Number(holdersCount) || 0,
    isLoading: !holders && !holdersCount,
  };
}

// Hook to get comprehensive snapshot data for multiple periods
export function usePeriodSnapshots(tokenAddress: `0x${string}`, periodIds: (bigint | number)[]) {
  const snapshotsData = periodIds.map((periodId) => {
    return useSnapshotInfo(tokenAddress, periodId);
  });

  const isLoading = snapshotsData.some(data => !data.formattedData);
  const formattedSnapshots = snapshotsData.map(data => data.formattedData).filter(Boolean) as SnapshotInfo[];

  // Calculate stats
  const totalSnapshots = formattedSnapshots.length;
  const eligibleHolders = formattedSnapshots.reduce((sum, snapshot) => sum + snapshot.holdersCount, 0);
  const latestSnapshot = formattedSnapshots.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0];

  return {
    snapshots: formattedSnapshots,
    totalSnapshots,
    totalEligibleHolders: eligibleHolders,
    latestSnapshot,
    isLoading,
  };
}

// Hook to get user's snapshot history across all periods
export function useUserSnapshotHistory(tokenAddress: `0x${string}`, periodIds: (bigint | number)[], userAddress: `0x${string}`) {
  const historyData = periodIds.map((periodId) => {
    return useUserSnapshotBalance(tokenAddress, periodId, userAddress);
  });

  const isLoading = historyData.some(data => !data.formattedData);
  const formattedHistory = historyData.map(data => data.formattedData).filter(Boolean) as UserSnapshotBalance[];

  // Calculate stats
  const totalEligiblePeriods = formattedHistory.filter(h => h.isEligible).length;
  const totalBalanceAcrossPeriods = formattedHistory.reduce((sum, h) => sum + h.balance, BigInt(0));
  const averageBalance = totalEligiblePeriods > 0 ? totalBalanceAcrossPeriods / BigInt(totalEligiblePeriods) : BigInt(0);
  const highestBalance = formattedHistory.reduce((max, h) => h.balance > max ? h.balance : max, BigInt(0));

  return {
    history: formattedHistory,
    totalEligiblePeriods,
    totalBalanceAcrossPeriods,
    averageBalance,
    highestBalance,
    isLoading,
  };
}

// Hook to check if snapshot can be triggered
export function useCanTriggerSnapshot(seriesId: bigint | number, periodId: bigint | number) {
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

  const { data: snapshotTaken } = useReadContract({
    address: (seriesInfo as any)?.tokenAddress as `0x${string}`,
    abi: YRT_TOKEN_ABI,
    functionName: 'isSnapshotTakenForPeriod' as any,
    args: [BigInt(periodId)] as any,
    query: {
      enabled: !!(seriesInfo as any)?.tokenAddress && !!periodId,
    }
  });

  const now = BigInt(Math.floor(Date.now() / 1000));
  const isMatured = periodInfo ? now >= (periodInfo as any).maturityDate : false;
  const hasYield = periodInfo ? (periodInfo as any).totalYield > BigInt(0) : false;
  const isActive = (periodInfo as any)?.isActive || false;

  const canTrigger = isActive && isMatured && hasYield && !Boolean(snapshotTaken);

  return {
    canTrigger,
    isMatured,
    hasYield,
    snapshotTaken: Boolean(snapshotTaken),
    maturityDate: (periodInfo as any)?.maturityDate,
    totalYield: (periodInfo as any)?.totalYield,
  };
}

// Utility functions for formatting snapshot data
export const formatSnapshotBalance = (balance: bigint, decimals: number = 18): string => {
  const amountStr = balance.toString();
  return formatAmount(String(Number(amountStr) / Math.pow(10, decimals)));
};

export const formatSnapshotPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

export const formatSnapshotTimestamp = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};

export const calculateYieldAmount = (userBalance: bigint, totalYield: bigint, totalSupply: bigint): bigint => {
  if (totalSupply === BigInt(0)) return BigInt(0);
  return (userBalance * totalYield) / totalSupply;
};

export default {
  useTriggerSnapshot,
  useSnapshotInfo,
  useUserSnapshotBalance,
  useTokenHolders,
  usePeriodSnapshots,
  useUserSnapshotHistory,
  useCanTriggerSnapshot,
  formatSnapshotBalance,
  formatSnapshotPercentage,
  formatSnapshotTimestamp,
  calculateYieldAmount,
};