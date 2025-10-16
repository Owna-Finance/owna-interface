import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_ROUTER_ABI } from '@/constants/abis/DEX_ROUTER_ABI';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';
import { OWNA_POOL_ABI } from '@/constants/abis/OWNA_POOL_ABI';

export interface AddLiquidityParams {
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  amountADesired: string;
  amountBDesired: string;
  amountAMin: string;
  amountBMin: string;
  to: `0x${string}`;
  deadline: number;
  propertyName: string;
  propertyOwner: `0x${string}`;
}

export interface RemoveLiquidityParams {
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  liquidity: string;
  amountAMin: string;
  amountBMin: string;
  to: `0x${string}`;
  deadline: number;
}

export interface SwapParams {
  amountIn: string;
  amountOutMin: string;
  path: `0x${string}`[];
  to: `0x${string}`;
  deadline: number;
}

export interface PoolInfo {
  address: `0x${string}`;
  token0: `0x${string}`;
  token1: `0x${string}`;
  token0Symbol: string;
  token1Symbol: string;
  token0Name?: string;
  token1Name?: string;
  reserve0: string;
  reserve1: string;
  propertyName: string;
  swapFee: string;
  totalSupply: string;
  isYRTPool: boolean;
}

export function useDEX() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Get pool address for token pair through factory (READ only)
  const useGetPool = (tokenA: `0x${string}`, tokenB: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.DEX_FACTORY_ADDRESS as `0x${string}`,
      abi: DEX_FACTORY_ABI,
      functionName: 'getPool',
      args: [tokenA, tokenB],
    });
  };

  // Get all pools count through factory (READ only)
  const {
    data: allPoolsLength,
    isLoading: isLoadingPoolsLength,
    error: poolsLengthError
  } = useReadContract({
    address: CONTRACTS.DEX_FACTORY_ADDRESS as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPoolsLength',
  });

  // Get pool at specific index through factory (READ only)
  const useAllPools = (index: number) => {
    return useReadContract({
      address: CONTRACTS.DEX_FACTORY_ADDRESS as `0x${string}`,
      abi: DEX_FACTORY_ABI,
      functionName: 'allPools',
      args: [BigInt(index)],
    });
  };

  // Get pool information (reserves, property name, etc.)
  const usePoolInfo = (poolAddress: `0x${string}`) => {
    return useReadContract({
      address: poolAddress,
      abi: OWNA_POOL_ABI,
      functionName: 'getReserves',
    });
  };

  // Get pool token addresses
  const usePoolTokens = (poolAddress: `0x${string}`) => {
    const token0 = useReadContract({
      address: poolAddress,
      abi: OWNA_POOL_ABI,
      functionName: 'token0',
    });

    const token1 = useReadContract({
      address: poolAddress,
      abi: OWNA_POOL_ABI,
      functionName: 'token1',
    });

    return { token0, token1 };
  };

  // Get pool metadata
  const usePoolMetadata = (poolAddress: `0x${string}`) => {
    const propertyName = useReadContract({
      address: poolAddress,
      abi: OWNA_POOL_ABI,
      functionName: 'propertyName',
    });

    const swapFee = useReadContract({
      address: poolAddress,
      abi: OWNA_POOL_ABI,
      functionName: 'swapFee',
    });

    const totalSupply = useReadContract({
      address: poolAddress,
      abi: OWNA_POOL_ABI,
      functionName: 'totalSupply',
    });

    return { propertyName, swapFee, totalSupply };
  };

  // Get token info (name, symbol, decimals)
  const useTokenInfo = (tokenAddress: `0x${string}`) => {
    const name = useReadContract({
      address: tokenAddress,
      abi: [
        {
          inputs: [],
          name: 'name',
          outputs: [{ internalType: 'string', name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'name',
    });

    const symbol = useReadContract({
      address: tokenAddress,
      abi: [
        {
          inputs: [],
          name: 'symbol',
          outputs: [{ internalType: 'string', name: '', type: 'string' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'symbol',
    });

    const decimals = useReadContract({
      address: tokenAddress,
      abi: [
        {
          inputs: [],
          name: 'decimals',
          outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'decimals',
    });

    return { name, symbol, decimals };
  };

  // Check if token is YRT token
  const useIsYRTToken = (tokenAddress: `0x${string}`) => {
    return useReadContract({
      address: CONTRACTS.YRT_FACTORY,
      abi: [
        {
          inputs: [{ internalType: 'address', name: '_tokenAddress', type: 'address' }],
          name: 'getSeriesIdByToken',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getSeriesIdByToken',
      args: [tokenAddress],
    });
  };

  // Get fee recipient through factory (READ only)
  const {
    data: feeRecipient
  } = useReadContract({
    address: CONTRACTS.DEX_FACTORY_ADDRESS as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'feeRecipient',
  });

  // Add liquidity to pool
  const addLiquidity = async (params: AddLiquidityParams) => {
    try {
      const amountADesiredWei = parseUnits(params.amountADesired, 18);
      const amountBDesiredWei = parseUnits(params.amountBDesired, 18);
      const amountAMinWei = parseUnits(params.amountAMin, 18);
      const amountBMinWei = parseUnits(params.amountBMin, 18);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER,
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
          BigInt(params.deadline),
          params.propertyName,
          params.propertyOwner,
        ],
      });
    } catch (error) {
      console.error('Error adding liquidity:', error);
      throw new Error('Failed to add liquidity. Please check your input values.');
    }
  };

  // Remove liquidity from pool
  const removeLiquidity = async (params: RemoveLiquidityParams) => {
    try {
      const liquidityWei = parseUnits(params.liquidity, 18);
      const amountAMinWei = parseUnits(params.amountAMin, 18);
      const amountBMinWei = parseUnits(params.amountBMin, 18);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER,
        abi: DEX_ROUTER_ABI,
        functionName: 'removeLiquidity',
        args: [
          params.tokenA,
          params.tokenB,
          liquidityWei,
          amountAMinWei,
          amountBMinWei,
          params.to,
          BigInt(params.deadline),
        ],
      });
    } catch (error) {
      console.error('Error removing liquidity:', error);
      throw new Error('Failed to remove liquidity. Please check your input values.');
    }
  };

  // Swap exact tokens for tokens
  const swapExactTokensForTokens = async (params: SwapParams) => {
    try {
      const amountInWei = parseUnits(params.amountIn, 18);
      const amountOutMinWei = parseUnits(params.amountOutMin, 18);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER,
        abi: DEX_ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountInWei,
          amountOutMinWei,
          params.path,
          params.to,
          BigInt(params.deadline),
        ],
      });
    } catch (error) {
      console.error('Error swapping tokens:', error);
      throw new Error('Failed to swap tokens. Please check your input values.');
    }
  };

  // Swap tokens for exact tokens
  const swapTokensForExactTokens = async (
    amountOut: string,
    amountInMax: string,
    path: `0x${string}`[],
    to: `0x${string}`,
    deadline: number
  ) => {
    try {
      const amountOutWei = parseUnits(amountOut, 18);
      const amountInMaxWei = parseUnits(amountInMax, 18);

      return writeContract({
        address: CONTRACTS.DEX_ROUTER,
        abi: DEX_ROUTER_ABI,
        functionName: 'swapTokensForExactTokens',
        args: [
          amountOutWei,
          amountInMaxWei,
          path,
          to,
          BigInt(deadline),
        ],
      });
    } catch (error) {
      console.error('Error swapping tokens:', error);
      throw new Error('Failed to swap tokens. Please check your input values.');
    }
  };

  // Get amounts out for swap
  const useGetAmountsOut = (amountIn: string, path: `0x${string}`[]) => {
    return useReadContract({
      address: CONTRACTS.DEX_ROUTER,
      abi: DEX_ROUTER_ABI,
      functionName: 'getAmountsOut',
      args: [parseUnits(amountIn || '0', 18), path],
    });
  };

  // Get amounts in for swap
  const useGetAmountsIn = (amountOut: string, path: `0x${string}`[]) => {
    return useReadContract({
      address: CONTRACTS.DEX_ROUTER,
      abi: DEX_ROUTER_ABI,
      functionName: 'getAmountsIn',
      args: [parseUnits(amountOut || '0', 18), path],
    });
  };

  // Quote function
  const quote = (amountA: string, reserveA: string, reserveB: string): string => {
    const amountABig = BigInt(amountA);
    const reserveABig = BigInt(reserveA);
    const reserveBBig = BigInt(reserveB);

    if (amountABig === BigInt(0)) return '0';
    if (reserveABig === BigInt(0) || reserveBBig === BigInt(0)) return '0';

    return ((amountABig * reserveBBig) / reserveABig).toString();
  };

  return {
    // Queries
    useGetPool,
    useAllPools,
    usePoolInfo,
    usePoolTokens,
    usePoolMetadata,
    useTokenInfo,
    useIsYRTToken,
    allPoolsLength,
    feeRecipient,
    isLoadingPoolsLength,
    poolsLengthError,

    // Swap queries
    useGetAmountsOut,
    useGetAmountsIn,

    // Write operations
    addLiquidity,
    removeLiquidity,
    swapExactTokensForTokens,
    swapTokensForExactTokens,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,

    // Utilities
    quote,
  };
}