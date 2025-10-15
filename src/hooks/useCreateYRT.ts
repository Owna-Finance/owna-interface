import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, LEGACY_CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { validateBaseSepolia } from '@/utils/chain-validation';

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
      // Validate Base Sepolia chain
      validateBaseSepolia(84532); // Chain ID is hardcoded since we only support Base Sepolia

      const initialSupplyWei = params.initialSupply
        ? parseUnits(params.initialSupply, 18)
        : BigInt(0);
      const tokenPriceWei = parseUnits(params.tokenPrice, 18);

      return writeContract({
        address: CONTRACTS.YRT_FACTORY,
        abi: YRT_FACTORY_ABI,
        functionName: 'createSeries',
        args: [
          params.name,
          params.symbol,
          params.propertyName,
          initialSupplyWei,
          params.underlyingToken,
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