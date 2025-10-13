import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DISTRIBUTOR_ABI } from '@/constants/abis/DISTRIBUTORAbi';
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
      return writeContract({
        address: CONTRACTS.DISTRIBUTOR,
        abi: DISTRIBUTOR_ABI,
        functionName: 'distributeToAllHolders',
        args: [
          BigInt(params.seriesId),
          BigInt(params.periodId),
        ],
      });
    } catch (error) {
      console.error('Error distributing to all holders:', error);
      throw new Error('Error distributing to all holders. Please check your input values.');
    }
  };

  // Handle transaction success and error states
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Distribution completed successfully!', {
        id: 'distribute-toast',
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        },
        duration: 5000,
        action: {
          label: 'View Transaction',
          onClick: () => window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank')
        }
      });
    }
  }, [isSuccess, hash]);

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

  useEffect(() => {
    if (isConfirming) {
      toast.loading('Confirming distribution transaction...', {
        id: 'distribute-toast',
        style: {
          background: '#111111',
          border: '1px solid #2A2A2A',
          color: '#ffffff',
        }
      });
    }
  }, [isConfirming]);

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