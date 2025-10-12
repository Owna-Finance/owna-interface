import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DISTRIBUTOR_ABI } from '@/constants/abis/DISTRIBUTORAbi';

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