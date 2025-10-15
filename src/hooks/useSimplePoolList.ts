import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';

export function useSimplePoolList() {
  // Try to get first few pools directly
  const pool0 = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(0)],
    query: {
      enabled: true,
    },
  });

  const pool1 = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(1)],
    query: {
      enabled: true,
    },
  });

  const pool2 = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(2)],
    query: {
      enabled: true,
    },
  });

  const pools = [pool0, pool1, pool2]
    .filter(query => query.data !== undefined)
    .map(query => query.data as `0x${string}`);

  const isLoading = pool0.isLoading || pool1.isLoading || pool2.isLoading;
  const isError = pool0.isError || pool1.isError || pool2.isError;

  
  return {
    pools,
    isLoading,
    isError,
  };
}