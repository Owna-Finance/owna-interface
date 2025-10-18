import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { USDC_ABI } from '@/constants/abis/USDCAbi';
import { IDRX_ABI } from '@/constants/abis/IDRXAbi';
import { DEX_ROUTER_ABI } from '@/constants/abis/DEX_ROUTER_ABI';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';
import { useGetAmountsOut as useGetAmountsOutUtil } from '@/utils/dex-discovery';
import { formatAmount } from '@coinbase/onchainkit/token';

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
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
}

export interface SimpleSwapParams {
  amountIn: string;
  amountOutMin: string;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  recipient: `0x${string}`;
  deadline: number;
}

// Utility to format token amounts using OnchainKit
const formatTokenAmount = (amount: string | number, decimals: number = 18): string => {
  return formatAmount(String(amount), {
    maximumFractionDigits: decimals,
  });
};

// Utility to parse and validate amounts
const parseAndValidateAmount = (amount: string, decimals: number = 18): bigint => {
  try {
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    return parseUnits(amount, decimals);
  } catch (error) {
    throw new Error(`Invalid amount: ${amount}. Please enter a valid number.`);
  }
};

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
      args: [params.userAddress, CONTRACTS.DEX_ROUTER as `0x${string}`],
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
      args: [params.userAddress, CONTRACTS.DEX_ROUTER as `0x${string}`],
      query: {
        enabled: !!params.userAddress && !!params.yrtAddress,
      }
    });
  };

  const useUSDCAllowance = (params: { userAddress: `0x${string}` }) => {
    return useReadContract({
      address: CONTRACTS.USDC as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'allowance',
      args: [params.userAddress, CONTRACTS.DEX_ROUTER as `0x${string}`],
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
      // All tokens (including mock USDC/IDRX) use 18 decimals in this testnet
      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: params.tokenAddress,
        abi: getTokenABI(params.tokenAddress),
        functionName: 'approve',
        args: [CONTRACTS.DEX_ROUTER as `0x${string}`, amountWei],
      });
    } catch (error) {
      throw new Error('Error approving token. Please try again.');
    }
  };

  const approveYRT = async (params: { yrtAddress: `0x${string}`; amount: string }) => {
    try {
      // YRT tokens also use 18 decimals
      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: params.yrtAddress,
        abi: USDC_ABI, // YRT uses same ERC20 interface
        functionName: 'approve',
        args: [CONTRACTS.DEX_ROUTER as `0x${string}`, amountWei],
      });
    } catch (error) {
      throw new Error('Error approving YRT. Please try again.');
    }
  };

  const approveUSDC = async (params: { amount: string }) => {
    try {
      // Mock USDC uses 18 decimals (not 6 like real USDC)
      const amountWei = parseUnits(params.amount, 18);

      return writeContract({
        address: CONTRACTS.USDC as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [CONTRACTS.DEX_ROUTER as `0x${string}`, amountWei],
      });
    } catch (error) {
      throw new Error('Error approving mock USDC (18 decimals). Please try again.');
    }
  };

  const swapExactTokensForTokens = async (params: SwapParams) => {
    try {
      // All tokens use 18 decimals (including mock USDC/IDRX)
      const amountInWei = parseUnits(params.amountIn, 18);
      const amountOutMinWei = parseUnits(params.amountOutMin, 18);
      const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + parseInt(params.deadline) * 60);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER as `0x${string}`,
        abi: DEX_ROUTER_ABI,
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
      throw new Error('Error swapping tokens. Please check your input values.');
    }
  };


  // Use utility function for getAmountsOut
  const useGetAmountsOut = (params: GetAmountsOutParams) => {
    return useGetAmountsOutUtil(params.amountIn || '0', [params.tokenIn, params.tokenOut]);
  };

  // Hook to check if pool exists
  const usePoolExists = (tokenA: `0x${string}`, tokenB: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.DEX_FACTORY as `0x${string}`,
      abi: DEX_FACTORY_ABI,
      functionName: 'getPool',
      args: [tokenA, tokenB],
      query: {
        enabled: !!tokenA && !!tokenB,
      }
    });
  };

  // Simple swap function with enhanced error handling and validation
  const swap = async (params: SimpleSwapParams) => {
    try {
      // Validate inputs
      if (!params.amountIn || parseFloat(params.amountIn) <= 0) {
        throw new Error('Invalid amount in. Please enter a valid amount.');
      }

      if (!params.tokenIn || !params.tokenOut) {
        throw new Error('Invalid token addresses. Please select valid tokens.');
      }

      if (params.tokenIn === params.tokenOut) {
        throw new Error('Cannot swap the same token. Please select different tokens.');
      }

      // Parse and validate amounts using OnchainKit utilities (18 decimals for all tokens)
      const amountInWei = parseAndValidateAmount(params.amountIn);
      const amountOutMinWei = parseAndValidateAmount(params.amountOutMin);
      const deadlineTimestamp = BigInt(params.deadline);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER as `0x${string}`,
        abi: DEX_ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInWei,
          amountOutMinWei,
          [params.tokenIn, params.tokenOut], // path: [tokenIn, tokenOut]
          params.recipient,
          deadlineTimestamp,
        ],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Swap failed: ${errorMessage}`);
    }
  };

  
  return {
    swap, // Enhanced simple swap function
    swapExactTokensForTokens,
    approveToken,
    approveYRT,
    approveUSDC,
    useTokenAllowance,
    useYRTAllowance,
    useUSDCAllowance,
    useGetAmountsOut,
    usePoolExists, // Hook for pool validation
    checkNeedsApproval,
    formatTokenAmount, // OnchainKit formatting utility
    parseAndValidateAmount, // Validation utility
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}