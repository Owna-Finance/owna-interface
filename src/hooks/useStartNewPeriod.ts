import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';

export interface StartNewPeriodParams {
  seriesId: string;
  durationInSeconds: number;
}

export function useStartNewPeriod() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const startNewPeriod = async (params: StartNewPeriodParams) => {
    try {
      return writeContract({
        address: CONTRACTS.YRT_FACTORY as `0x${string}`,
        abi: YRT_FACTORY_ABI,
        functionName: 'startNewPeriod',
        args: [
          params.seriesId,
          params.durationInSeconds,
        ],
      });
    } catch (error) {
      console.error('Error starting new period:', error);
      throw new Error('Error starting new period. Please check your input values.');
    }
  };

  return {
    startNewPeriod,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}