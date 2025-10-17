import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { OWNA_POOL_ABI } from '@/constants/abis/OWNA_POOL_ABI';
import { formatAmount } from '@coinbase/onchainkit/token';

export interface WithdrawStableParams {
  poolAddress: `0x${string}`;
  amount: string;
  to: `0x${string}`;
}

export interface InjectStableParams {
  poolAddress: `0x${string}`;
  amount: string;
}

export interface PropertyOwnerControlsParams {
  poolAddress: `0x${string}`;
  newPropertyOwner: `0x${string}`;
  newFeeRecipient: `0x${string}`;
  newSwapFee: number;
}

export function usePropertyOwnerControls() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Withdraw stablecoin (USDC/IDRX) from pool
  const withdrawStable = async (params: WithdrawStableParams) => {
    try {
      const amountWei = parseUnits(params.amount, 18); // All tokens use 18 decimals

      return writeContract({
        address: params.poolAddress,
        abi: OWNA_POOL_ABI,
        functionName: 'ownerWithdrawStable',
        args: [amountWei, params.to],
      });
    } catch (error) {
      console.error('Error withdrawing stablecoin:', error);
      throw new Error('Error withdrawing stablecoin. Please check your input values.');
    }
  };

  // Inject stablecoin into pool
  const injectStable = async (params: InjectStableParams) => {
    try {
      const amountWei = parseUnits(params.amount, 18); // All tokens use 18 decimals

      return writeContract({
        address: params.poolAddress,
        abi: OWNA_POOL_ABI,
        functionName: 'ownerInjectStable',
        args: [amountWei],
      });
    } catch (error) {
      console.error('Error injecting stablecoin:', error);
      throw new Error('Error injecting stablecoin. Please check your input values.');
    }
  };

  // Set property owner
  const setPropertyOwner = async (poolAddress: `0x${string}`, newPropertyOwner: `0x${string}`) => {
    try {
      return writeContract({
        address: poolAddress,
        abi: OWNA_POOL_ABI,
        functionName: 'setPropertyOwner',
        args: [newPropertyOwner],
      });
    } catch (error) {
      console.error('Error setting property owner:', error);
      throw new Error('Error setting property owner. Please check the address.');
    }
  };

  // Set fee recipient
  const setFeeRecipient = async (poolAddress: `0x${string}`, newFeeRecipient: `0x${string}`) => {
    try {
      return writeContract({
        address: poolAddress,
        abi: OWNA_POOL_ABI,
        functionName: 'setFeeRecipient',
        args: [newFeeRecipient],
      });
    } catch (error) {
      console.error('Error setting fee recipient:', error);
      throw new Error('Error setting fee recipient. Please check the address.');
    }
  };

  // Update swap fee
  const setSwapFee = async (poolAddress: `0x${string}`, newSwapFee: number) => {
    try {
      return writeContract({
        address: poolAddress,
        abi: OWNA_POOL_ABI,
        functionName: 'setSwapFee',
        args: [newSwapFee],
      });
    } catch (error) {
      console.error('Error setting swap fee:', error);
      throw new Error('Error setting swap fee. Fee must be <= 100 (1%).');
    }
  };

  return {
    withdrawStable,
    injectStable,
    setPropertyOwner,
    setFeeRecipient,
    setSwapFee,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    isLoading: isPending || isConfirming,
  };
}

// Hook to get pool information for property owner
export function usePoolInfoForOwner(poolAddress: `0x${string}`) {
  const { data: reserves } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'getReserves',
    query: {
      enabled: !!poolAddress,
    }
  });

  const { data: token0 } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'token0',
    query: {
      enabled: !!poolAddress,
    }
  });

  const { data: token1 } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'token1',
    query: {
      enabled: !!poolAddress,
    }
  });

  const { data: propertyOwner } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'propertyOwner',
    query: {
      enabled: !!poolAddress,
    }
  });

  const { data: feeRecipient } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'feeRecipient',
    query: {
      enabled: !!poolAddress,
    }
  });

  const { data: swapFee } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'swapFee',
    query: {
      enabled: !!poolAddress,
    }
  });

  const { data: propertyName } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'propertyName',
    query: {
      enabled: !!poolAddress,
    }
  });

  // Format data for display
  const formattedReserves = reserves ? {
    reserve0: formatAmount(String(Number((reserves as [bigint, bigint])[0]) / Math.pow(10, 18))),
    reserve1: formatAmount(String(Number((reserves as [bigint, bigint])[1]) / Math.pow(10, 18))),
  } : null;

  const formattedSwapFee = swapFee ? Number(swapFee) / 100 : 0; // Convert basis points to percentage

  return {
    reserves,
    token0,
    token1,
    propertyOwner,
    feeRecipient,
    swapFee,
    propertyName,
    formattedReserves,
    formattedSwapFee,
  };
}

// Hook to check if user is property owner
export function useIsPropertyOwner(poolAddress: `0x${string}`, userAddress: `0x${string}` | undefined) {
  const { data: propertyOwner } = useReadContract({
    address: poolAddress,
    abi: OWNA_POOL_ABI,
    functionName: 'propertyOwner',
    query: {
      enabled: !!poolAddress && !!userAddress,
    }
  });

  return {
    isPropertyOwner: propertyOwner && userAddress ?
      (propertyOwner as `0x${string}`).toLowerCase() === userAddress.toLowerCase() : false,
    propertyOwner,
  };
}

export default {
  usePropertyOwnerControls,
  usePoolInfoForOwner,
  useIsPropertyOwner,
};