import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { USDC_ABI } from '@/constants/abis/USDCAbi';
import { IDRX_ABI } from '@/constants/abis/IDRXAbi';
import { DEX_ROUTER_ABI } from '@/constants/abis/DEX_ROUTER_ABI';

export interface AddLiquidityParams {
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  amountADesired: string;
  amountBDesired: string;
  amountAMin: string;
  amountBMin: string;
  to: `0x${string}`;
  deadline: string;
  propertyName: string;
  propertyOwner: `0x${string}`;
}

export interface TokenApprovalParams {
  tokenAddress: `0x${string}`;
  amount: string;
  userAddress: `0x${string}`;
}

export function useAddLiquidity() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const getTokenABI = (tokenAddress: string) => {
    if (tokenAddress === CONTRACTS.USDC) return USDC_ABI;
    if (tokenAddress === CONTRACTS.IDRX) return IDRX_ABI;
    return USDC_ABI; // fallback
  };

  const useTokenAllowance = (params: TokenApprovalParams) => {
    return useReadContract({
      address: params.tokenAddress,
      abi: getTokenABI(params.tokenAddress),
      functionName: 'allowance',
      args: [params.userAddress, CONTRACTS.DEX_ROUTER],
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

  const approveToken = async (params: TokenApprovalParams) => {
    try {
      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: params.tokenAddress,
        abi: getTokenABI(params.tokenAddress),
        functionName: 'approve',
        args: [CONTRACTS.DEX_ROUTER, amountWei],
      });
    } catch (error) {
      console.error('Error approving token:', error);
      throw new Error('Error approving token. Please try again.');
    }
  };

  const addLiquidity = async (params: AddLiquidityParams) => {
    try {
      const amountADesiredWei = parseUnits(params.amountADesired, 18);
      const amountBDesiredWei = parseUnits(params.amountBDesired, 18);
      const amountAMinWei = parseUnits(params.amountAMin, 18);
      const amountBMinWei = parseUnits(params.amountBMin, 18);
      const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + parseInt(params.deadline) * 60);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER as `0x${string}`,
        abi: DEX_ROUTER_ABI,
        functionName: 'addLiquidity',
        args: [
          params.tokenA,
          params.tokenB,
          amountADesiredWei,
          amountBDesiredWei,
          amountAMinWei,
          amountBMinWei,
          params.to,
          deadlineTimestamp,
          params.propertyName,
          params.propertyOwner,
        ],
      });
    } catch (error) {
      console.error('Error adding liquidity:', error);
      throw new Error('Error adding liquidity. Please check your input values.');
    }
  };

  return {
    addLiquidity,
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