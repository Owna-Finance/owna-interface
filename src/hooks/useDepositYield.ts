import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { USDC_ABI } from '@/constants/abis/USDCAbi';
import { IDRX_ABI } from '@/constants/abis/IDRXAbi';

export interface DepositYieldParams {
  seriesId: string;
  periodId: string;
  amount: string;
  tokenAddress: `0x${string}`;
}

export interface ApprovalParams {
  tokenAddress: `0x${string}`;
  amount: string;
  userAddress: `0x${string}`;
}

export function useDepositYield() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const getTokenABI = (tokenAddress: string) => {
    if (tokenAddress === CONTRACTS.USDC) return USDC_ABI;
    if (tokenAddress === CONTRACTS.IDRX) return IDRX_ABI;
    return USDC_ABI; // fallback
  };

  const useTokenAllowance = (params: ApprovalParams) => {
    return useReadContract({
      address: params.tokenAddress,
      abi: getTokenABI(params.tokenAddress),
      functionName: 'allowance',
      args: [params.userAddress, CONTRACTS.YRT_FACTORY],
      query: {
        enabled: !!params.userAddress && !!params.tokenAddress,
        refetchInterval: 10000, // Refetch every 10 seconds to get updated allowance
        refetchIntervalInBackground: false,
      }
    });
  };

  const checkNeedsApproval = (currentAllowance: bigint | undefined, requiredAmount: string): boolean => {
    if (!currentAllowance) return true;
    const requiredAmountWei = parseUnits(requiredAmount, 18);
    return currentAllowance < requiredAmountWei;
  };

  const approveToken = async (params: ApprovalParams) => {
    try {
      if (!params.amount || parseFloat(params.amount) <= 0) {
        throw new Error('Invalid amount for approval');
      }

      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: params.tokenAddress,
        abi: getTokenABI(params.tokenAddress),
        functionName: 'approve',
        args: [CONTRACTS.YRT_FACTORY, amountWei],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to approve token. Please try again.');
    }
  };

  const depositYield = async (params: DepositYieldParams) => {
    try {
      if (!params.seriesId || !params.periodId || !params.amount) {
        throw new Error('All fields are required');
      }

      if (parseFloat(params.amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Enhanced validation for seriesId and periodId
      const seriesIdNum = params.seriesId.trim();
      const periodIdNum = params.periodId.trim();

      if (seriesIdNum === '' || periodIdNum === '') {
        throw new Error('Series ID and Period ID cannot be empty');
      }

      // Check if inputs are valid numbers
      if (!/^\d+$/.test(seriesIdNum) || !/^\d+$/.test(periodIdNum)) {
        throw new Error('Series ID and Period ID must be valid numbers');
      }

      // Check for extremely large numbers
      if (seriesIdNum.length > 20 || periodIdNum.length > 20) {
        throw new Error('Series ID or Period ID seems too large');
      }

      // Convert to BigInt with error handling
      let seriesIdBigInt, periodIdBigInt;
      try {
        seriesIdBigInt = BigInt(seriesIdNum);
        periodIdBigInt = BigInt(periodIdNum);
      } catch (error) {
        throw new Error('Invalid Series ID or Period ID format. Must be valid numbers.');
      }

      // Check for negative or zero values
      if (seriesIdBigInt <= 0n || periodIdBigInt <= 0n) {
        throw new Error('Series ID and Period ID must be greater than 0');
      }

      // Check for unreasonably large values
      if (seriesIdBigInt > 1000000n || periodIdBigInt > 1000000n) {
        throw new Error('Series ID or Period ID seems too large. Please check your input.');
      }

      const amountWei = parseUnits(params.amount, 18);

      // Log debug info
      console.log('Deposit Yield Contract Call:', {
        seriesId: seriesIdBigInt.toString(),
        periodId: periodIdBigInt.toString(),
        amountWei: amountWei.toString(),
        amountHuman: params.amount
      });

      return writeContract({
        address: CONTRACTS.YRT_FACTORY as `0x${string}`,
        abi: YRT_FACTORY_ABI,
        functionName: 'depositYield',
        args: [
          seriesIdBigInt,
          periodIdBigInt,
          amountWei,
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        // Add more specific error handling for common issues
        if (error.message.includes('BigInt')) {
          throw new Error('Invalid number format for Series ID or Period ID');
        }
        if (error.message.includes('allowance') || error.message.includes('approval')) {
          throw new Error('Insufficient allowance. Please approve USDC first.');
        }
        if (error.message.includes('gas') || error.message.includes('estimate')) {
          throw new Error('Network fee estimation failed. Please try with a smaller amount.');
        }
        throw error;
      }
      throw new Error('Failed to deposit yield: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return {
    depositYield,
    approveToken,
    useTokenAllowance,
    checkNeedsApproval,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}