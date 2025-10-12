import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { USDC_ABI } from '@/constants/abis/USDCAbi';
import { IDRX_ABI } from '@/constants/abis/IDRXAbi';
import { DEX_ABI } from '@/constants/abis/DEXAbi';

export interface SwapParams {
  amountIn: string;
  amountOutMin: string;
  path: `0x${string}`[];
  to: `0x${string}`;
  deadline: string;
}

export interface TokenApprovalParams {
  tokenAddress: `0x${string}`;
  amount: string;
  userAddress: `0x${string}`;
}

export interface DualTokenApprovalParams {
  yrtAddress: `0x${string}`;
  yrtAmount: string;
  usdcAmount: string;
  userAddress: `0x${string}`;
}

export interface GetAmountsOutParams {
  amountIn: string;
  path: `0x${string}`[];
}

export function useSwap() {
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
      args: [params.userAddress, CONTRACTS.DEX],
      query: {
        enabled: !!params.userAddress && !!params.tokenAddress,
      }
    });
  };

  const useYRTAllowance = (params: { yrtAddress: `0x${string}`; userAddress: `0x${string}` }) => {
    return useReadContract({
      address: params.yrtAddress,
      abi: USDC_ABI, // YRT uses same ERC20 interface
      functionName: 'allowance',
      args: [params.userAddress, CONTRACTS.DEX],
      query: {
        enabled: !!params.userAddress && !!params.yrtAddress,
      }
    });
  };

  const useUSDCAllowance = (params: { userAddress: `0x${string}` }) => {
    return useReadContract({
      address: CONTRACTS.USDC,
      abi: USDC_ABI,
      functionName: 'allowance',
      args: [params.userAddress, CONTRACTS.DEX],
      query: {
        enabled: !!params.userAddress,
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
        args: [CONTRACTS.DEX, amountWei],
      });
    } catch (error) {
      console.error('Error approving token:', error);
      throw new Error('Error approving token. Please try again.');
    }
  };

  const approveYRT = async (params: { yrtAddress: `0x${string}`; amount: string }) => {
    try {
      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: params.yrtAddress,
        abi: USDC_ABI, // YRT uses same ERC20 interface
        functionName: 'approve',
        args: [CONTRACTS.DEX, amountWei],
      });
    } catch (error) {
      console.error('Error approving YRT:', error);
      throw new Error('Error approving YRT. Please try again.');
    }
  };

  const approveUSDC = async (params: { amount: string }) => {
    try {
      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: CONTRACTS.USDC,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [CONTRACTS.DEX, amountWei],
      });
    } catch (error) {
      console.error('Error approving USDC:', error);
      throw new Error('Error approving USDC. Please try again.');
    }
  };

  const swapExactTokensForTokens = async (params: SwapParams) => {
    try {
      const amountInWei = parseUnits(params.amountIn, 18);
      const amountOutMinWei = parseUnits(params.amountOutMin, 18);
      const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + parseInt(params.deadline) * 60);

      return writeContract({
        address: CONTRACTS.DEX,
        abi: DEX_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInWei,
          amountOutMinWei,
          params.path,
          params.to,
          deadlineTimestamp,
        ],
      });
    } catch (error) {
      console.error('Error swapping tokens:', error);
      throw new Error('Error swapping tokens. Please check your input values.');
    }
  };


  const useGetAmountsOut = (params: GetAmountsOutParams) => {
    return useReadContract({
      address: CONTRACTS.DEX,
      abi: DEX_ABI,
      functionName: 'getAmountsOut',
      args: [
        parseUnits(params.amountIn || '0', 18),
        params.path
      ],
      query: {
        enabled: !!params.amountIn && !!params.path && params.path.length >= 2 && params.amountIn !== '0',
      }
    });
  };

  return {
    swapExactTokensForTokens,
    approveToken,
    approveYRT,
    approveUSDC,
    useTokenAllowance,
    useYRTAllowance,
    useUSDCAllowance,
    useGetAmountsOut,
    checkNeedsApproval,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}