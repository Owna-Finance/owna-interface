'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useSwap } from '@/hooks';
import { useAllPools } from '@/hooks/useAllPools';
import { formatUnits } from 'viem';
import { SwapHeader, SwapForm } from './_components';
import { toast } from 'sonner';
import { ExternalLink, AlertCircle } from 'lucide-react';

type TokenType = 'YRT' | 'USDC' | 'IDRX';

interface SwapFormData {
  poolAddress: `0x${string}`;
  tokenFrom: TokenType;
  tokenTo: TokenType;
  amountFrom: string;
  amountTo: string;
  slippage: string;
  deadline: string;
  yrtAddress: `0x${string}`;
  propertyName?: string;
}

type SwapStep = 'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed';

export default function SwapPage() {
  const { address } = useAccount();
  const { swapExactTokensForTokens, approveYRT, approveUSDC, useYRTAllowance, useUSDCAllowance, useGetAmountsOut, checkNeedsApproval, hash, isPending, isSuccess, error } = useSwap();
  const { pools, isLoading: isLoadingPools, getAvailableTokens, getYRTPools } = useAllPools();

  const [formData, setFormData] = useState<SwapFormData>({
    poolAddress: '0x0000000000000000000000000000000000000000',
    tokenFrom: 'USDC',
    tokenTo: 'YRT',
    amountFrom: '',
    amountTo: '',
    slippage: '1',
    deadline: '20',
    yrtAddress: '0x0000000000000000000000000000000000000000'
  });

  const [currentStep, setCurrentStep] = useState<SwapStep>('idle');
  const [yrtApprovalHash, setYrtApprovalHash] = useState<`0x${string}` | undefined>();
  const [usdcApprovalHash, setUsdcApprovalHash] = useState<`0x${string}` | undefined>();
  const [swapHash, setSwapHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isTransactionConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const getTokenAddress = (token: TokenType): `0x${string}` => {
    if (token === 'USDC') return CONTRACTS.USDC;
    if (token === 'IDRX') return CONTRACTS.IDRX;
    if (token === 'YRT') return formData.yrtAddress;
    return CONTRACTS.USDC;
  };

  const { data: yrtAllowance, refetch: refetchYrtAllowance } = useYRTAllowance({
    yrtAddress: (formData.yrtAddress || '0x0000000000000000000000000000000000000000'),
    userAddress: (address || '0x0000000000000000000000000000000000000000')
  });

  const { data: usdcAllowance, refetch: refetchUsdcAllowance } = useUSDCAllowance({
    userAddress: (address || '0x0000000000000000000000000000000000000000')
  });

  const needsYrtApproval = (() => {
    if (!formData.yrtAddress || !address) return false;
    const yrtAmount = formData.tokenFrom === 'YRT' ? formData.amountFrom : formData.amountTo;
    if (!yrtAmount) return false;
    if (yrtAllowance === undefined || yrtAllowance === null) return true;
    // Handle if yrtAllowance is an object (wagmi query result)
    const allowanceValue = typeof yrtAllowance === 'bigint' ? yrtAllowance : (yrtAllowance as any)?.result;
    return checkNeedsApproval(allowanceValue, yrtAmount);
  })();

  const needsUsdcApproval = (() => {
    if (!address) return false;
    const usdcAmount = formData.tokenFrom === 'USDC' ? formData.amountFrom : formData.amountTo;
    if (!usdcAmount) return false;
    if (usdcAllowance === undefined || usdcAllowance === null) return true;
    // Handle if usdcAllowance is an object (wagmi query result)
    const allowanceValue = typeof usdcAllowance === 'bigint' ? usdcAllowance : (usdcAllowance as any)?.result;
    return checkNeedsApproval(allowanceValue, usdcAmount);
  })();

  const swapPath: `0x${string}`[] = (() => {
    if (!formData.yrtAddress || !formData.poolAddress || formData.poolAddress === '0x0000000000000000000000000000000000000000') return [];

    const fromAddress = getTokenAddress(formData.tokenFrom);
    const toAddress = getTokenAddress(formData.tokenTo);

    return [fromAddress, toAddress];
  })();

  const { data: amountsOut } = useGetAmountsOut({
    amountIn: formData.amountFrom || '0',
    path: swapPath
  });

  // Auto-fill functionality when From token changes to USDC
  useEffect(() => {
    if (formData.tokenFrom === 'USDC' && formData.tokenTo !== 'YRT') {
      setFormData(prev => ({
        ...prev,
        tokenTo: 'YRT',
        yrtAddress: '0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991' // YRT Sudirman address
      }));
    } else if (formData.tokenFrom === 'IDRX' && formData.tokenTo !== 'YRT') {
      setFormData(prev => ({
        ...prev,
        tokenTo: 'YRT',
        yrtAddress: '0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991' // YRT Sudirman address
      }));
    }
  }, [formData.tokenFrom, formData.tokenTo]);

  useEffect(() => {
    if (amountsOut && formData.amountFrom && formData.amountFrom !== '0' && Array.isArray(amountsOut) && amountsOut.length > 1) {
      const outputAmount = amountsOut[1];
      const calculatedAmount = formatUnits(outputAmount, 18);
      setFormData(prev => ({
        ...prev,
        amountTo: parseFloat(calculatedAmount).toFixed(6)
      }));
    } else if (!formData.amountFrom || formData.amountFrom === '0') {
      setFormData(prev => ({
        ...prev,
        amountTo: ''
      }));
    }
  }, [amountsOut, formData.amountFrom, formData.tokenFrom, formData.tokenTo, formData.yrtAddress]);


  const calculateAmountOutMin = (amountOut: string, slippage: string): string => {
    if (!amountOut || !slippage) return '0';
    const amountNum = parseFloat(amountOut);
    const slippageNum = parseFloat(slippage);
    const minAmount = amountNum * (1 - slippageNum / 100);
    return minAmount.toString();
  };


  useEffect(() => {
    if (isTransactionSuccess && hash) {
      if (currentStep === 'approving-yrt') {
        setYrtApprovalHash(hash);
        setCurrentStep('yrt-approved');
        refetchYrtAllowance();
        toast.success('YRT approved successfully!', {
          description: (
            <p className="text-xs font-mono text-white break-all">
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" /> <span>View On Explorer</span>
              </a>
            </p>
          )
        });
      } else if (currentStep === 'approving-usdc') {
        setUsdcApprovalHash(hash);
        setCurrentStep('tokens-approved');
        refetchUsdcAllowance();
        const tokenName = formData.tokenFrom === 'USDC' ? 'USDC' : formData.tokenFrom === 'IDRX' ? 'IDRX' : 'Token';
        toast.success(`${tokenName} approved successfully!`, {
          description: (
            <p className="text-xs font-mono text-white break-all">
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" /> <span>View On Explorer</span>
              </a>
            </p>
          )
        });
      } else if (currentStep === 'swapping') {
        setSwapHash(hash);
        setCurrentStep('completed');
        toast.success('Tokens swapped successfully!', {
          description: (
            <p className="text-xs font-mono text-white break-all">
              <a
                href={`https://sepolia.basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" /> <span>View On Explorer</span>
              </a>
            </p>
          )
        });
      }
    }
  }, [isTransactionSuccess, currentStep, hash, refetchYrtAllowance, refetchUsdcAllowance, formData.tokenFrom]);

  const handleApproveYRT = async (): Promise<boolean> => {
    if (!address || !formData.yrtAddress) return false;

    try {
      setCurrentStep('approving-yrt');
      const yrtAmount = formData.tokenFrom === 'YRT' ? formData.amountFrom : formData.amountTo;

      await approveYRT({
        yrtAddress: formData.yrtAddress,
        amount: yrtAmount
      });

      return true;
    } catch (error) {
      setCurrentStep('idle');
      toast.error('Failed to approve YRT', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      return false;
    }
  };

  const handleApproveUSDC = async (): Promise<boolean> => {
    if (!address) return false;
    
    try {
      setCurrentStep('approving-usdc');
      const usdcAmount = formData.tokenFrom === 'USDC' ? formData.amountFrom : formData.amountTo;
      
      await approveUSDC({
        amount: usdcAmount
      });
      
      return true;
    } catch (error) {
      setCurrentStep('idle');
      const tokenName = formData.tokenFrom === 'USDC' ? 'USDC' : formData.tokenFrom === 'IDRX' ? 'IDRX' : 'Token';
      toast.error(`Failed to approve ${tokenName}`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      return false;
    }
  };

  const handleSwap = async (): Promise<void> => {
    if (!address || !formData.yrtAddress) return;
    
    try {
      setCurrentStep('swapping');
      
      const path: `0x${string}`[] = [
        getTokenAddress(formData.tokenFrom),
        getTokenAddress(formData.tokenTo)
      ];

      const amountOutMin = calculateAmountOutMin(formData.amountTo, formData.slippage);
      
      await swapExactTokensForTokens({
        amountIn: formData.amountFrom,
        amountOutMin,
        path,
        to: address,
        deadline: formData.deadline
      });
      
    } catch (error) {
      setCurrentStep('idle');
      toast.error('Failed to swap tokens', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to continue'
      });
      return;
    }

    if (!formData.yrtAddress || !formData.amountFrom || !formData.amountTo) {
      toast.error('Form incomplete', {
        description: 'Please fill in all required fields'
      });
      return;
    }

    if (needsYrtApproval && currentStep === 'idle') {
      const yrtApprovalSuccess = await handleApproveYRT();
      if (!yrtApprovalSuccess) return;
    }

    else if (needsUsdcApproval && (currentStep === 'yrt-approved' || (!needsYrtApproval && currentStep === 'idle'))) {
      const usdcApprovalSuccess = await handleApproveUSDC();
      if (!usdcApprovalSuccess) return;
    }

    else if (currentStep === 'tokens-approved' || (!needsYrtApproval && !needsUsdcApproval)) {
      await handleSwap();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'amountFrom' || name === 'yrtAddress') {
      setCurrentStep('idle');
      setYrtApprovalHash(undefined);
      setUsdcApprovalHash(undefined);
      setSwapHash(undefined);
    }
  };

  const handleSwapTokens = () => {
    setFormData(prev => ({
      ...prev,
      tokenFrom: prev.tokenTo,
      tokenTo: prev.tokenFrom,
      amountFrom: prev.amountTo,
      amountTo: '' 
    }));
    setCurrentStep('idle');
    setYrtApprovalHash(undefined);
    setUsdcApprovalHash(undefined);
    setSwapHash(undefined);
  };

  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      tokenFrom: 'USDC',
      tokenTo: 'YRT',
      yrtAddress: '0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991',
      amountFrom: '100',
      amountTo: ''
    }));
    setCurrentStep('idle');
    setYrtApprovalHash(undefined);
    setUsdcApprovalHash(undefined);
    setSwapHash(undefined);
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto px-6 py-8">
        <SwapHeader onFillSampleData={fillSampleData} />
        
        <SwapForm
          formData={formData}
          currentStep={currentStep}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onSwapTokens={handleSwapTokens}
          onPoolSelect={(poolAddress, token0, token1, propertyName) => {
            setFormData(prev => ({
              ...prev,
              poolAddress: poolAddress as `0x${string}`,
              yrtAddress: (token1.includes('YRT') ? token1 : token0) as `0x${string}`, // YRT token address
              propertyName
            }));
          }}
          onTokenSelect={(tokenFrom, tokenTo) => {
            setFormData(prev => ({
              ...prev,
              tokenFrom: tokenFrom as TokenType,
              tokenTo: tokenTo as TokenType
            }));
            setCurrentStep('idle');
            setYrtApprovalHash(undefined);
            setUsdcApprovalHash(undefined);
            setSwapHash(undefined);
          }}
          needsYrtApproval={needsYrtApproval}
          needsUsdcApproval={needsUsdcApproval}
          yrtApprovalHash={yrtApprovalHash}
          usdcApprovalHash={usdcApprovalHash}
          swapHash={swapHash}
          isTransactionConfirming={isTransactionConfirming}
          isPending={isPending}
          address={address}
        />

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Swaps are executed through the DEX smart contract
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}