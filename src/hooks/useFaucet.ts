import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { USDC_ABI } from '@/constants/abis/USDCAbi';
import { IDRX_ABI } from '@/constants/abis/IDRXAbi';

export type TokenType = 'USDC' | 'IDRX';

export function useFaucet() {
  const { address } = useAccount();
  const [currentToken, setCurrentToken] = useState<TokenType | null>(null);
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintToken = async (tokenType: TokenType, amount: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setCurrentToken(tokenType);

    const tokenAddress = tokenType === 'USDC' ? CONTRACTS.USDC : CONTRACTS.IDRX;
    const tokenAbi = tokenType === 'USDC' ? USDC_ABI : IDRX_ABI;
    
    // Both tokens use 18 decimals
    const amountInWei = parseUnits(amount, 18);

    try {
      writeContract({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: 'mint',
        args: [address, amountInWei],
      });
    } catch (err) {
      setCurrentToken(null);
      throw err;
    }
  };

  return {
    mintToken,
    isPending,
    isConfirming,
    isSuccess,
    error,
    currentToken,
    hash,
  };
}
