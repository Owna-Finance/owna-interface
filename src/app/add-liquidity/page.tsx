'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { Plus, Droplets, DollarSign, Clock, Building } from 'lucide-react';
import { useAddLiquidity } from '@/hooks';

export default function AddLiquidityPage() {
  const { address } = useAccount();
  const { addLiquidity, approveToken, useTokenAllowance, checkNeedsApproval, hash, isPending, isSuccess, error } = useAddLiquidity();
  
  const [formData, setFormData] = useState({
    tokenA: CONTRACTS.USDC as `0x${string}`,
    tokenB: CONTRACTS.USDC as `0x${string}`,
    amountADesired: '',
    amountBDesired: '',
    slippage: '5', // 5% default slippage
    to: address || '' as `0x${string}`,
    deadline: '20', // 20 minutes default
    propertyName: '',
    propertyOwner: address || '' as `0x${string}`
  });

  const [currentStep, setCurrentStep] = useState<'idle' | 'approving-token-a' | 'token-a-approved' | 'approving-token-b' | 'tokens-approved' | 'adding-liquidity' | 'completed'>('idle');
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const [liquidityHash, setLiquidityHash] = useState<`0x${string}` | undefined>();

  // Wait for current transaction (either approval or liquidity)
  const { isLoading: isTransactionConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Get allowances for both Token A (YRT) and Token B (USDC)
  const { data: tokenAAllowance, refetch: refetchTokenAAllowance } = useTokenAllowance({
    tokenAddress: formData.tokenA,
    amount: formData.amountADesired || '0',
    userAddress: (address || '0x0000000000000000000000000000000000000000') as `0x${string}`
  });

  const { data: tokenBAllowance, refetch: refetchTokenBAllowance } = useTokenAllowance({
    tokenAddress: formData.tokenB,
    amount: formData.amountBDesired || '0',
    userAddress: (address || '0x0000000000000000000000000000000000000000') as `0x${string}`
  });

  const needsTokenAApproval = (() => {
    if (!formData.amountADesired || !address || !formData.tokenA) return false;
    if (tokenAAllowance === undefined) return true; // Assume approval needed if we can't check
    return checkNeedsApproval(tokenAAllowance as bigint, formData.amountADesired);
  })();

  const needsTokenBApproval = (() => {
    if (!formData.amountBDesired || !address) return false;
    if (tokenBAllowance === undefined) return true; // Assume approval needed if we can't check
    return checkNeedsApproval(tokenBAllowance as bigint, formData.amountBDesired);
  })();

  // Calculate slippage amounts
  const calculateSlippageAmount = (amount: string, slippage: string): string => {
    if (!amount || !slippage) return '0';
    const amountNum = parseFloat(amount);
    const slippageNum = parseFloat(slippage);
    const minAmount = amountNum * (1 - slippageNum / 100);
    return minAmount.toString();
  };

  const amountAMin = calculateSlippageAmount(formData.amountADesired, formData.slippage);
  const amountBMin = calculateSlippageAmount(formData.amountBDesired, formData.slippage);

  // Handle transaction confirmation
  useEffect(() => {
    if (isTransactionSuccess && hash) {
      if (currentStep === 'approving-token-a') {
        setApprovalHash(hash);
        setCurrentStep('token-a-approved');
        refetchTokenAAllowance(); // Refresh allowance after approval
      } else if (currentStep === 'approving-token-b') {
        setApprovalHash(hash);
        setCurrentStep('tokens-approved');
        refetchTokenBAllowance(); // Refresh allowance after approval
      } else if (currentStep === 'adding-liquidity') {
        setLiquidityHash(hash);
        setCurrentStep('completed');
      }
    }
  }, [isTransactionSuccess, currentStep, hash, refetchTokenAAllowance, refetchTokenBAllowance]);

  const handleApproveTokenA = async (): Promise<boolean> => {
    if (!address || !formData.amountADesired || !formData.tokenA) return false;
    
    try {
      setCurrentStep('approving-token-a');
      await approveToken({
        tokenAddress: formData.tokenA,
        amount: formData.amountADesired,
        userAddress: address as `0x${string}`
      });
      
      // Transaction hash will be handled by useEffect when isTransactionSuccess becomes true
      return true;
    } catch (error) {
      setCurrentStep('idle');
      alert(error instanceof Error ? error.message : 'Failed to approve Token A (YRT)');
      return false;
    }
  };

  const handleApproveTokenB = async (): Promise<boolean> => {
    if (!address || !formData.amountBDesired) return false;
    
    try {
      setCurrentStep('approving-token-b');
      await approveToken({
        tokenAddress: formData.tokenB,
        amount: formData.amountBDesired,
        userAddress: address as `0x${string}`
      });
      
      // Transaction hash will be handled by useEffect when isTransactionSuccess becomes true
      return true;
    } catch (error) {
      setCurrentStep('idle');
      const tokenName = formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX';
      alert(error instanceof Error ? error.message : `Failed to approve ${tokenName}`);
      return false;
    }
  };

  const handleAddLiquidity = async (): Promise<void> => {
    if (!address) return;
    
    try {
      setCurrentStep('adding-liquidity');
      await addLiquidity({
        tokenA: formData.tokenA,
        tokenB: formData.tokenB,
        amountADesired: formData.amountADesired,
        amountBDesired: formData.amountBDesired,
        amountAMin,
        amountBMin,
        to: address as `0x${string}`,
        deadline: formData.deadline,
        propertyName: formData.propertyName,
        propertyOwner: formData.propertyOwner
      });
      
      // Transaction hash will be handled by useEffect when isTransactionSuccess becomes true
    } catch (error) {
      setCurrentStep('idle');
      alert(error instanceof Error ? error.message : 'Failed to add liquidity');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    // Check if all required fields are filled
    if (!formData.tokenA || !formData.amountADesired || !formData.amountBDesired || 
        !formData.propertyName || !formData.propertyOwner) {
      alert('Please fill in all required fields');
      return;
    }

    // Step 1: Approve Token A (YRT) if needed
    if (needsTokenAApproval && currentStep === 'idle') {
      const approvalSuccess = await handleApproveTokenA();
      if (!approvalSuccess) return;
      // Approval transaction will be handled by useEffect
    }
    // Step 2: Approve Token B (USDC/IDRX) if needed
    else if (needsTokenBApproval && currentStep === 'token-a-approved') {
      const approvalSuccess = await handleApproveTokenB();
      if (!approvalSuccess) return;
      // Approval transaction will be handled by useEffect
    }
    // Step 3: Add liquidity (after both tokens are approved or if no approvals needed)
    else if (currentStep === 'tokens-approved' || (!needsTokenAApproval && !needsTokenBApproval)) {
      await handleAddLiquidity();
    }
    // Handle case where only Token B needs approval
    else if (!needsTokenAApproval && needsTokenBApproval && currentStep === 'idle') {
      const approvalSuccess = await handleApproveTokenB();
      if (!approvalSuccess) return;
    }
    // Handle case where only Token A needs approval
    else if (needsTokenAApproval && !needsTokenBApproval && currentStep === 'token-a-approved') {
      await handleAddLiquidity();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tokenA' || name === 'tokenB' || name === 'to' || name === 'propertyOwner' 
        ? value as `0x${string}` 
        : value
    }));
    
    // Reset current step when amounts change
    if (name === 'amountADesired' || name === 'amountBDesired' || name === 'tokenB') {
      setCurrentStep('idle');
      setApprovalHash(undefined);
      setLiquidityHash(undefined);
    }
  };

  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      tokenA: '0x8DE41E5c1CB99a8658401058a0c685caFE06a886' as `0x${string}`,
      amountADesired: '100',
      amountBDesired: '1000',
      slippage: '5',
      to: '0xebFACa8463E1c3495a09684137fEd7A4b4574179' as `0x${string}`,
      propertyName: 'Sudirman Residence Pool',
      propertyOwner: '0xebFACa8463E1c3495a09684137fEd7A4b4574179' as `0x${string}`
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Add Liquidity</h1>
          <p className="text-gray-400">Add liquidity to create or join a liquidity pool for YRT tokens</p>
        </div>

        {/* Sample Data Button */}
        <div className="mb-6">
          <Button
            type="button"
            onClick={fillSampleData}
            variant="outline"
            className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Fill Sample Data
          </Button>
        </div>

        {/* Form */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Token Pair Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Droplets className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Token Pair</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token A Address
                  </label>
                  <input
                    type="text"
                    name="tokenA"
                    value={formData.tokenA}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Contract address of YRT Token</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token B
                  </label>
                  <select
                    name="tokenB"
                    value={formData.tokenB}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value={CONTRACTS.USDC}>USDC</option>
                    <option value={CONTRACTS.IDRX}>IDRX</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Amounts */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-white">Amounts</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount A Desired
                  </label>
                  <input
                    type="number"
                    name="amountADesired"
                    value={formData.amountADesired}
                    onChange={handleInputChange}
                    placeholder="1000"
                    step="0.000001"
                    min="0"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Amount of Token A (YRT) to add to pool</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount B Desired
                  </label>
                  <input
                    type="number"
                    name="amountBDesired"
                    value={formData.amountBDesired}
                    onChange={handleInputChange}
                    placeholder="1000"
                    step="0.000001"
                    min="0"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {needsTokenBApproval ? '⚠️ Will require approval' : '✅ Sufficient allowance'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slippage Tolerance (%)
                  </label>
                  <input
                    type="number"
                    name="slippage"
                    value={formData.slippage}
                    onChange={handleInputChange}
                    placeholder="5"
                    step="0.1"
                    min="0.1"
                    max="50"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum price slippage you'll accept</p>
                </div>
                
                <div className='hidden'>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Token A Amount
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-gray-400">
                    {amountAMin || '0'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Calculated from slippage</p>
                </div>
                
                <div className='hidden'>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Token B Amount
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-gray-400">
                    {amountBMin || '0'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Calculated from slippage</p>
                </div>
              </div>
            </div>

            {/* Transaction Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-white">Transaction Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deadline (minutes)
                  </label>
                  <input
                    type="number"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    placeholder="20"
                    step="1"
                    min="1"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Transaction deadline from now</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Address to receive LP tokens</p>
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Property Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    placeholder="e.g., Sudirman Residence Pool"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Name for this liquidity pool</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Property Owner
                  </label>
                  <input
                    type="text"
                    name="propertyOwner"
                    value={formData.propertyOwner}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Owner of the property</p>
                </div>
              </div>
            </div>

            {/* Debug Info - Remove this after fixing */}
            {(formData.amountADesired || formData.amountBDesired) && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg mb-4">
                <p className="text-xs text-white">DEBUG INFO:</p>
                <p className="text-xs text-gray-300">Token A: {formData.tokenA}</p>
                <p className="text-xs text-gray-300">Amount A: {formData.amountADesired}</p>
                <p className="text-xs text-gray-300">Token A Allowance: {tokenAAllowance?.toString() || 'undefined'}</p>
                <p className="text-xs text-gray-300">Needs Token A Approval: {needsTokenAApproval ? 'YES' : 'NO'}</p>
                <p className="text-xs text-gray-300">Token B: {formData.tokenB}</p>
                <p className="text-xs text-gray-300">Amount B: {formData.amountBDesired}</p>
                <p className="text-xs text-gray-300">Token B Allowance: {tokenBAllowance?.toString() || 'undefined'}</p>
                <p className="text-xs text-gray-300">Needs Token B Approval: {needsTokenBApproval ? 'YES' : 'NO'}</p>
                <p className="text-xs text-gray-300">Current Step: {currentStep}</p>
                <p className="text-xs text-gray-300">Address: {address ? 'Connected' : 'Not connected'}</p>
              </div>
            )}

            {/* Transaction Status */}
            {(approvalHash || liquidityHash || currentStep !== 'idle') && (
              <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg space-y-3">
                {/* Token B Approval Status */}
                {(approvalHash || currentStep === 'approving' || currentStep === 'approved' || (currentStep !== 'idle' && needsTokenBApproval)) && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-300">
                        {formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX'} Approval:
                      </span>
                      {currentStep === 'approving' && isTransactionConfirming && (
                        <span className="text-xs text-yellow-400">⏳ Confirming...</span>
                      )}
                      {(currentStep === 'approved' || currentStep === 'adding-liquidity' || currentStep === 'completed') && needsTokenBApproval && (
                        <span className="text-xs text-green-400">✅ Approved</span>
                      )}
                      {!needsTokenBApproval && (
                        <span className="text-xs text-gray-400">Not required</span>
                      )}
                    </div>
                    {approvalHash && (
                      <p className="text-xs font-mono text-blue-400 break-all">
                        {formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX'}: {approvalHash}
                      </p>
                    )}
                  </div>
                )}

                {/* Liquidity Status */}
                {(liquidityHash || currentStep === 'adding-liquidity' || currentStep === 'completed') && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-300">Add Liquidity:</span>
                      {currentStep === 'adding-liquidity' && isTransactionConfirming && (
                        <span className="text-xs text-yellow-400">⏳ Confirming...</span>
                      )}
                      {currentStep === 'completed' && (
                        <span className="text-xs text-green-400">✅ Completed</span>
                      )}
                    </div>
                    {liquidityHash && (
                      <p className="text-xs font-mono text-blue-400 break-all">Liquidity: {liquidityHash}</p>
                    )}
                  </div>
                )}

                {/* Current Step Info */}
                {currentStep === 'idle' && needsTokenBApproval && (
                  <p className="text-sm text-yellow-400">
                    {formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX'} approval required before adding liquidity
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={(currentStep !== 'idle' && currentStep !== 'token-a-approved' && currentStep !== 'tokens-approved') || !address}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(currentStep.includes('approving') || currentStep === 'adding-liquidity') ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    <span>
                      {currentStep === 'approving-token-a' ? 'Approving YRT...' :
                       currentStep === 'approving-token-b' ? `Approving ${formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX'}...` :
                       currentStep === 'adding-liquidity' ? 'Adding Liquidity...' : 'Processing...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Droplets className="w-4 h-4" />
                    <span>
                      {currentStep === 'completed' ? 'Completed!' :
                       needsTokenAApproval && currentStep === 'idle' ? 'Approve YRT & Add Liquidity' :
                       needsTokenBApproval && currentStep === 'token-a-approved' ? `Approve ${formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX'}` :
                       currentStep === 'tokens-approved' ? 'Add Liquidity' :
                       (!needsTokenAApproval && needsTokenBApproval && currentStep === 'idle') ? `Approve ${formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX'} & Add Liquidity` :
                       'Add Liquidity'}
                    </span>
                  </>
                )}
              </Button>
            </div>

            {!address && (
              <p className="text-center text-red-400 text-sm">
                Please connect your wallet to add liquidity
              </p>
            )}
          </form>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">How Adding Liquidity Works</h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              <p>Approve Token B (USDC/IDRX) for the required amount</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              <p>Tokens will be deposited into the liquidity pool</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              <p>You'll receive LP tokens representing your share of the pool</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</span>
              <p>Earn fees from trades that happen in your pool</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}