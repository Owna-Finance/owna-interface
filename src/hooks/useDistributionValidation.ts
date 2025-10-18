import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { YRT_TOKEN_ABI } from '@/constants/abis/YRT_TOKEN_ABI';

export interface DistributionValidation {
  canDistribute: boolean;
  isSnapshotTaken: boolean;
  hasYield: boolean;
  isPeriodActive: boolean;
  isPeriodMatured: boolean;
  errorMessage?: string;
}

/**
 * Hook to validate if distribution can be executed
 * Checks:
 * 1. Period has matured (matured periods can distribute even if inactive)
 * 2. Snapshot has been taken
 * 3. Period has yield deposited
 * Note: Period doesn't need to be active to distribute - matured periods can still distribute
 */
export function useDistributionValidation(
  seriesId: string | undefined,
  periodId: string | undefined
): DistributionValidation {

  // Get series info to get token address
  const { data: seriesInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesInfo',
    args: seriesId ? [BigInt(seriesId)] : undefined,
    query: {
      enabled: !!seriesId,
    }
  });

  // Get period info
  const { data: periodInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY as `0x${string}`,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: seriesId && periodId ? [BigInt(seriesId), BigInt(periodId)] : undefined,
    query: {
      enabled: !!seriesId && !!periodId,
    }
  });

  // Check if snapshot is taken
  const tokenAddress = (seriesInfo as any)?.tokenAddress as `0x${string}` | undefined;

  const { data: isSnapshotTaken } = useReadContract({
    address: tokenAddress,
    abi: YRT_TOKEN_ABI,
    functionName: 'isSnapshotTakenForPeriod' as any,
    args: periodId ? [BigInt(periodId)] as any : undefined,
    query: {
      enabled: !!tokenAddress && !!periodId,
    }
  });

  // Validate period
  if (!periodInfo) {
    return {
      canDistribute: false,
      isSnapshotTaken: false,
      hasYield: false,
      isPeriodActive: false,
      isPeriodMatured: false,
      errorMessage: 'Period not found',
    };
  }

  const period = periodInfo as any;
  const isActive = period.isActive || false;
  const totalYield = period.totalYield ? BigInt(period.totalYield) : BigInt(0);
  const hasYield = totalYield > BigInt(0);

  // Check if period is matured
  const now = BigInt(Math.floor(Date.now() / 1000));
  const maturityDate = period.maturityDate ? BigInt(period.maturityDate) : BigInt(0);
  const isPeriodMatured = now >= maturityDate;

  const snapshotTaken = Boolean(isSnapshotTaken);

  // Determine if can distribute
  let canDistribute = true;
  let errorMessage: string | undefined;

  // Period must be matured to distribute, but doesn't need to be active
  // Matured periods can still distribute even if they're no longer active
  if (!isPeriodMatured) {
    canDistribute = false;
    errorMessage = 'Period has not matured yet';
  } else if (!snapshotTaken) {
    canDistribute = false;
    errorMessage = 'Snapshot has not been taken. Please wait for Chainlink automation.';
  } else if (!hasYield) {
    canDistribute = false;
    errorMessage = 'No yield deposited for this period';
  }
  // Note: We don't check isActive here because matured periods can still distribute

  return {
    canDistribute,
    isSnapshotTaken: snapshotTaken,
    hasYield,
    isPeriodActive: isActive,
    isPeriodMatured,
    errorMessage,
  };
}
