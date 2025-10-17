import { useReadContract } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DEX_FACTORY_ABI } from '@/constants/abis/DEX_FACTORY_ABI';

export function useSimplePoolList() {
  // First, try to read feeRecipient to test basic contract connectivity
  const feeRecipient = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'feeRecipient',
    query: {
      enabled: true,
    },
  });

  // Then check if we can read the factory length to verify contract is accessible
  const factoryLength = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPoolsLength',
    query: {
      enabled: true,
    },
  });

  // Debug logs
  console.log('useSimplePoolList Debug - Updated');
  console.log('CONTRACTS.DEX_FACTORY:', CONTRACTS.DEX_FACTORY);
  console.log('feeRecipient (basic test):', {
    data: feeRecipient.data,
    isLoading: feeRecipient.isLoading,
    isError: feeRecipient.isError,
    error: feeRecipient.error?.message
  });
  console.log('factoryLength:', {
    data: factoryLength.data?.toString(),
    isLoading: factoryLength.isLoading,
    isError: factoryLength.isError,
    error: factoryLength.error?.message
  });

  // Try to get first few pools directly only if we have factory length
  const pool0 = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(0)],
    query: {
      enabled: factoryLength.data !== undefined && factoryLength.data !== null && Number(factoryLength.data) > 0,
    },
  });

  const pool1 = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(1)],
    query: {
      enabled: factoryLength.data !== undefined && factoryLength.data !== null && Number(factoryLength.data) > 1,
    },
  });

  const pool2 = useReadContract({
    address: CONTRACTS.DEX_FACTORY as `0x${string}`,
    abi: DEX_FACTORY_ABI,
    functionName: 'allPools',
    args: [BigInt(2)],
    query: {
      enabled: factoryLength.data !== undefined && factoryLength.data !== null && Number(factoryLength.data) > 2,
    },
  });

  // Debug logs
  console.log('useSimplePoolList Debug - Pool Data:');
  console.log('pool0:', { data: pool0.data, isLoading: pool0.isLoading, isError: pool0.isError, error: pool0.error?.message });
  console.log('pool1:', { data: pool1.data, isLoading: pool1.isLoading, isError: pool1.isError, error: pool1.error?.message });
  console.log('pool2:', { data: pool2.data, isLoading: pool2.isLoading, isError: pool2.isError, error: pool2.error?.message });

  const pools = [pool0, pool1, pool2]
    .filter(query => query.data !== undefined)
    .map(query => query.data as `0x${string}`);

  const isLoading = pool0.isLoading || pool1.isLoading || pool2.isLoading;
  const isError = pool0.isError || pool1.isError || pool2.isError;

  console.log('useSimplePoolList Result:', { pools, isLoading, isError });

  return {
    pools,
    isLoading,
    isError,
  };
}