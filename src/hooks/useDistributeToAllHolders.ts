import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { AUTO_DISTRIBUTOR_ABI } from '@/constants/abis/AUTO_DISTRIBUTOR_ABI';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface DistributeToAllHoldersParams {
  seriesId: string;
  periodId: string;
}

export function useDistributeToAllHolders() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const distributeToAllHolders = async (params: DistributeToAllHoldersParams) => {
    try {
      // Validate inputs
      if (!params.seriesId || !params.periodId) {
        throw new Error('Series ID and Period ID are required');
      }

      const seriesIdBigInt = BigInt(params.seriesId);
      const periodIdBigInt = BigInt(params.periodId);

      if (seriesIdBigInt <= 0 || periodIdBigInt <= 0) {
        throw new Error('Series ID and Period ID must be greater than 0');
      }

      return writeContract({
        address: CONTRACTS.AUTO_DISTRIBUTOR as `0x${string}`,
        abi: AUTO_DISTRIBUTOR_ABI,
        functionName: 'distributeToAllHolders',
        args: [seriesIdBigInt, periodIdBigInt],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to distribute yield. Please ensure snapshot is taken and yield is deposited.');
    }
  };

  // Success toast is now handled by the component to avoid conflicts
  // Removed success toast from hook to prevent duplicate toasts

  useEffect(() => {
    if (error) {
      toast.error(`Distribution failed: ${error.message}`, {
        id: 'distribute-toast',
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });
    }
  }, [error]);

  return {
    distributeToAllHolders,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}