import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';

export interface CreatePoolParams {
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  propertyName: string;
  propertyOwner: `0x${string}`;
}

export function useCreatePool() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createPool = async (params: CreatePoolParams) => {
    try {
      return writeContract({
        address: CONTRACTS.DEX_FACTORY as `0x${string}`, // Use factory directly for createPool
        abi: DEX_FACTORY_ABI,
        functionName: 'createPool',
        args: [
          params.tokenA,
          params.tokenB,
          params.propertyName,
          params.propertyOwner,
        ],
      });
    } catch (error) {
      console.error('Error creating pool:', error);
      throw new Error('Error creating DEX pool. Please check your input values.');
    }
  };

  return {
    createPool,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}