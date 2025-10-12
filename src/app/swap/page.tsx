'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { ArrowUpDown, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { useSwap, GetAmountsOutParams } from '@/hooks';
import { formatUnits } from 'viem';

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

  const [currentStep, setCurrentStep] = useState<'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed'>('idle');
  const [yrtApprovalHash, setYrtApprovalHash] = useState<`0x${string}` | undefined>();
  const [usdcApprovalHash, setUsdcApprovalHash] = useState<`0x${string}` | undefined>();
  const [swapHash, setSwapHash] = useState<`0x${string}` | undefined>();

  // Wait for current transaction
  const { isLoading: isTransactionConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Get token address based on selection
  const getTokenAddress = (token: TokenType): `0x${string}` => {
    if (token === 'USDC') return CONTRACTS.USDC;
    if (token === 'YRT') return formData.yrtAddress as `0x${string}`;
    return CONTRACTS.USDC; // fallback
  };

  // Get allowances for both YRT and USDC
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

  // Create path for swap
  const swapPath: `0x${string}`[] = (() => {
    if (!formData.yrtAddress) return [];
    
    const fromAddress = getTokenAddress(formData.tokenFrom);
    const toAddress = getTokenAddress(formData.tokenTo);
    
    return [fromAddress, toAddress];
  })();

  // Get amounts out calculation
  const { data: amountsOut } = useGetAmountsOut({
    amountIn: formData.amountFrom || '0',
    path: swapPath
  });

  // Update amountTo when amountFrom changes
  useEffect(() => {
    if (amountsOut && formData.amountFrom && formData.amountFrom !== '0' && Array.isArray(amountsOut) && amountsOut.length > 1) {
      const outputAmount = amountsOut[1] as bigint; // Second element is the output amount
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

  // Calculate minimum amount out with slippage
  const calculateAmountOutMin = (amountOut: string, slippage: string): string => {
    if (!amountOut || !slippage) return '0';
    const amountNum = parseFloat(amountOut);
    const slippageNum = parseFloat(slippage);
    const minAmount = amountNum * (1 - slippageNum / 100);
    return minAmount.toString();
  };

  // Handle transaction confirmation
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
      
      // Create path array
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

    // Step 1: Approve YRT if needed
    if (needsYrtApproval && currentStep === 'idle') {
      const yrtApprovalSuccess = await handleApproveYRT();
      if (!yrtApprovalSuccess) return;
    }
    // Step 2: Approve USDC if needed
    else if (needsUsdcApproval && (currentStep === 'yrt-approved' || (!needsYrtApproval && currentStep === 'idle'))) {
      const usdcApprovalSuccess = await handleApproveUSDC();
      if (!usdcApprovalSuccess) return;
    }
    // Step 3: Swap tokens
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
    
    // Reset when amounts change (except amountTo since it's calculated)
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
      amountTo: '' // Will be recalculated automatically
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
      amountTo: '' // Will be calculated automatically
    }));
    setCurrentStep('idle');
    setYrtApprovalHash(undefined);
    setUsdcApprovalHash(undefined);
    setSwapHash(undefined);
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Swap</h1>
          <p className="text-gray-400">Exchange tokens instantly</p>
        </div>

        {/* Sample Data Button */}
        <div className="mb-6 text-center">
          <Button
            type="button"
            onClick={fillSampleData}
            variant="outline"
            className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Fill Sample Data
          </Button>
        </div>

        {/* Swap Form */}
        <div className="bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* YRT Address Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YRT Token Address
              </label>
              <input
                type="text"
                name="yrtAddress"
                value={formData.yrtAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* From Token */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">From</label>
                <select
                  name="tokenFrom"
                  value={formData.tokenFrom}
                  onChange={handleInputChange}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="USDC">USDC</option>
                  <option value="YRT">YRT</option>
                </select>
              </div>
              <input
                type="number"
                name="amountFrom"
                value={formData.amountFrom}
                onChange={handleInputChange}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="w-full px-4 py-4 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                required
              />
              {(needsYrtApproval || needsUsdcApproval) && (
                <p className="text-xs text-yellow-400">
                  ⚠️ Approval required: {needsYrtApproval && 'YRT'} {needsYrtApproval && needsUsdcApproval && '& '} {needsUsdcApproval && 'USDC'}
                </p>
              )}
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleSwapTokens}
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-gray-800 p-2"
              >
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">To</label>
                <select
                  name="tokenTo"
                  value={formData.tokenTo}
                  onChange={handleInputChange}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="USDC">USDC</option>
                  <option value="YRT">YRT</option>
                </select>
              </div>
              <input
                type="number"
                name="amountTo"
                value={formData.amountTo}
                placeholder="0.0"
                readOnly
                className="w-full px-4 py-4 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-xl placeholder-gray-500 cursor-not-allowed opacity-75"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slippage (%)
                </label>
                <input
                  type="number"
                  name="slippage"
                  value={formData.slippage}
                  onChange={handleInputChange}
                  placeholder="1"
                  step="0.1"
                  min="0.1"
                  max="50"
                  className="w-full px-3 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Deadline (min)
                </label>
                <input
                  type="number"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  placeholder="20"
                  step="1"
                  min="1"
                  className="w-full px-3 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Transaction Status */}
            {(yrtApprovalHash || usdcApprovalHash || swapHash || currentStep !== 'idle') && (
              <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg space-y-2">
                {(yrtApprovalHash || currentStep === 'approving-yrt' || currentStep === 'yrt-approved' || currentStep === 'approving-usdc' || currentStep === 'tokens-approved' || currentStep === 'swapping' || currentStep === 'completed') && (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">YRT Approval:</span>
                      {currentStep === 'approving-yrt' && isTransactionConfirming && (
                        <span className="text-xs text-yellow-400">⏳ Confirming...</span>
                      )}
                      {(currentStep === 'yrt-approved' || currentStep === 'approving-usdc' || currentStep === 'tokens-approved' || currentStep === 'swapping' || currentStep === 'completed') && (
                        <span className="text-xs text-green-400">✅ Approved</span>
                      )}
                    </div>
                    {yrtApprovalHash && (
                      <p className="text-xs font-mono text-blue-400 break-all">
                        {yrtApprovalHash}
                      </p>
                    )}
                  </div>
                )}

                {(usdcApprovalHash || currentStep === 'approving-usdc' || currentStep === 'tokens-approved' || currentStep === 'swapping' || currentStep === 'completed') && (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">USDC Approval:</span>
                      {currentStep === 'approving-usdc' && isTransactionConfirming && (
                        <span className="text-xs text-yellow-400">⏳ Confirming...</span>
                      )}
                      {(currentStep === 'tokens-approved' || currentStep === 'swapping' || currentStep === 'completed') && (
                        <span className="text-xs text-green-400">✅ Approved</span>
                      )}
                    </div>
                    {usdcApprovalHash && (
                      <p className="text-xs font-mono text-blue-400 break-all">
                        {usdcApprovalHash}
                      </p>
                    )}
                  </div>
                )}

                {(swapHash || currentStep === 'swapping' || currentStep === 'completed') && (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">Swap:</span>
                      {currentStep === 'swapping' && isTransactionConfirming && (
                        <span className="text-xs text-yellow-400">⏳ Confirming...</span>
                      )}
                      {currentStep === 'completed' && (
                        <span className="text-xs text-green-400">✅ Completed</span>
                      )}
                    </div>
                    {swapHash && (
                      <p className="text-xs font-mono text-blue-400 break-all">
                        {swapHash}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending || !address || (currentStep !== 'idle' && currentStep !== 'yrt-approved' && currentStep !== 'tokens-approved')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(currentStep === 'approving-yrt' || currentStep === 'approving-usdc' || currentStep === 'swapping') ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  <span>
                    {currentStep === 'approving-yrt' ? 'Approving YRT...' :
                     currentStep === 'approving-usdc' ? 'Approving USDC...' :
                     currentStep === 'swapping' ? 'Swapping...' : 'Processing...'}
                  </span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>
                    {currentStep === 'completed' ? 'Completed!' :
                     needsYrtApproval && currentStep === 'idle' ? 'Approve YRT' :
                     needsUsdcApproval && currentStep === 'yrt-approved' ? 'Approve USDC' :
                     currentStep === 'tokens-approved' ? 'Swap Tokens' :
                     (!needsYrtApproval && needsUsdcApproval && currentStep === 'idle') ? 'Approve USDC' :
                     'Swap Tokens'}
                  </span>
                </>
              )}
            </Button>

            {!address && (
              <p className="text-center text-red-400 text-sm">
                Please connect your wallet to swap tokens
              </p>
            )}
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Swaps are executed through the DEX smart contract
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}