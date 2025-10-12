'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useSwap } from '@/hooks';
import { formatUnits } from 'viem';
import { SwapHeader, SwapForm } from './_components';

type TokenType = 'YRT' | 'USDC';

interface SwapFormData {
  tokenFrom: TokenType;
  tokenTo: TokenType;
  amountFrom: string;
  amountTo: string;
  slippage: string;
  deadline: string;
  yrtAddress: string;
}

type SwapStep = 'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed';

export default function SwapPage() {
  const { address } = useAccount();
  const { swapExactTokensForTokens, approveYRT, approveUSDC, useYRTAllowance, useUSDCAllowance, useGetAmountsOut, checkNeedsApproval, hash, isPending, isSuccess, error } = useSwap();
  
  const [formData, setFormData] = useState<SwapFormData>({
    tokenFrom: 'USDC',
    tokenTo: 'YRT',
    amountFrom: '',
    amountTo: '',
    slippage: '1',
    deadline: '20',
    yrtAddress: ''
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
    if (token === 'YRT') return formData.yrtAddress as `0x${string}`;
    return CONTRACTS.USDC;
  };

  const { data: yrtAllowance, refetch: refetchYrtAllowance } = useYRTAllowance({
    yrtAddress: (formData.yrtAddress || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    userAddress: (address || '0x0000000000000000000000000000000000000000') as `0x${string}`
  });

  const { data: usdcAllowance, refetch: refetchUsdcAllowance } = useUSDCAllowance({
    userAddress: (address || '0x0000000000000000000000000000000000000000') as `0x${string}`
  });

  const needsYrtApproval = (() => {
    if (!formData.yrtAddress || !address) return false;
    const yrtAmount = formData.tokenFrom === 'YRT' ? formData.amountFrom : formData.amountTo;
    if (!yrtAmount) return false;
    if (yrtAllowance === undefined) return true;
    return checkNeedsApproval(yrtAllowance as bigint, yrtAmount);
  })();

  const needsUsdcApproval = (() => {
    if (!address) return false;
    const usdcAmount = formData.tokenFrom === 'USDC' ? formData.amountFrom : formData.amountTo;
    if (!usdcAmount) return false;
    if (usdcAllowance === undefined) return true;
    return checkNeedsApproval(usdcAllowance as bigint, usdcAmount);
  })();

  const swapPath: `0x${string}`[] = (() => {
    if (!formData.yrtAddress) return [];
    
    const fromAddress = getTokenAddress(formData.tokenFrom);
    const toAddress = getTokenAddress(formData.tokenTo);
    
    return [fromAddress, toAddress];
  })();

  const { data: amountsOut } = useGetAmountsOut({
    amountIn: formData.amountFrom || '0',
    path: swapPath
  });

  useEffect(() => {
    if (amountsOut && formData.amountFrom && formData.amountFrom !== '0' && Array.isArray(amountsOut) && amountsOut.length > 1) {
      const outputAmount = amountsOut[1] as bigint;
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
      } else if (currentStep === 'approving-usdc') {
        setUsdcApprovalHash(hash);
        setCurrentStep('tokens-approved');
        refetchUsdcAllowance();
      } else if (currentStep === 'swapping') {
        setSwapHash(hash);
        setCurrentStep('completed');
      }
    }
  }, [isTransactionSuccess, currentStep, hash, refetchYrtAllowance, refetchUsdcAllowance]);

  const handleApproveYRT = async (): Promise<boolean> => {
    if (!address || !formData.yrtAddress) return false;
    
    try {
      setCurrentStep('approving-yrt');
      const yrtAmount = formData.tokenFrom === 'YRT' ? formData.amountFrom : formData.amountTo;
      
      await approveYRT({
        yrtAddress: formData.yrtAddress as `0x${string}`,
        amount: yrtAmount
      });
      
      return true;
    } catch (error) {
      setCurrentStep('idle');
      alert(error instanceof Error ? error.message : 'Failed to approve YRT');
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
      alert(error instanceof Error ? error.message : 'Failed to approve USDC');
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
        to: address as `0x${string}`,
        deadline: formData.deadline
      });
      
    } catch (error) {
      setCurrentStep('idle');
      alert(error instanceof Error ? error.message : 'Failed to swap tokens');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!formData.yrtAddress || !formData.amountFrom || !formData.amountTo) {
      alert('Please fill in all required fields');
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
      yrtAddress: '0x8DE41E5c1CB99a8658401058a0c685caFE06a886',
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