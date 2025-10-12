import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_ABI } from '@/constants/abis/YRTAbi';

export interface CreateYRTParams {
  name: string;
  symbol: string;
  propertyName: string;
  initialSupply: string;
  tokenPrice: string;
  underlyingToken: string;
  fundraisingDuration: number;
}

export function useCreateYRT() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createYRTSeries = async (params: CreateYRTParams) => {
    try {
      const initialSupplyWei = params.initialSupply 
        ? parseUnits(params.initialSupply, 18) 
        : BigInt(0);
      const tokenPriceWei = parseUnits(params.tokenPrice, 18);

      return writeContract({
        address: CONTRACTS.FACTORY,
        abi: YRT_ABI,
        functionName: 'createSeries',
        args: [
          params.name,
          params.symbol,
          params.propertyName,
          initialSupplyWei,
          params.underlyingToken as `0x${string}`,
          tokenPriceWei,
          params.fundraisingDuration,
        ],
      });
    } catch (error) {
      console.error('Error creating YRT series:', error);
      throw new Error('Error creating YRT series. Please check your input values.');
    }
  };

  return {
    createYRTSeries,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}