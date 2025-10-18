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

      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: CONTRACTS.YRT_FACTORY as `0x${string}`,
        abi: YRT_FACTORY_ABI,
        functionName: 'depositYield',
        args: [
          BigInt(params.seriesId),
          BigInt(params.periodId),
          amountWei,
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to deposit yield. Please check your inputs.');
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