'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { Plus, Building, DollarSign, Calendar } from 'lucide-react';
import { useCreateYRT, useYRTForm, useStartNewPeriod, useDepositYield } from '@/hooks';
import { useState } from 'react';

export default function CreateYRTPage() {
  const { address } = useAccount();
  const { formData, handleInputChange, fillSampleData, isFormValid } = useYRTForm();
  const { createYRTSeries, hash, isLoading, isSuccess, error } = useCreateYRT();
  const { startNewPeriod, hash: periodHash, isLoading: isPeriodLoading, isSuccess: isPeriodSuccess, error: periodError } = useStartNewPeriod();
  const { depositYield, approveToken, useTokenAllowance, checkNeedsApproval, hash: yieldHash, isLoading: isYieldLoading, isSuccess: isYieldSuccess, error: yieldError } = useDepositYield();
  
  const [periodFormData, setPeriodFormData] = useState({
    seriesId: '',
    durationInSeconds: 300 // 5 minutes default
  });

  const [yieldFormData, setYieldFormData] = useState({
    seriesId: '',
    periodId: '',
    amount: '',
    tokenAddress: CONTRACTS.USDC as `0x${string}`
  });

  const [approvalStep, setApprovalStep] = useState<'check' | 'approve' | 'deposit'>('check');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createYRTSeries(formData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create YRT series');
    }
  };

  const handlePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!periodFormData.seriesId || !periodFormData.durationInSeconds) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await startNewPeriod(periodFormData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to start new period');
    }
  };

  const handlePeriodInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPeriodFormData(prev => ({
      ...prev,
      [name]: name === 'durationInSeconds' ? Number(value) : value
    }));
  };

  // Get allowance for the selected token
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance({
    tokenAddress: yieldFormData.tokenAddress,
    amount: yieldFormData.amount,
    userAddress: address as `0x${string}`
  });

  const needsApproval = yieldFormData.amount ? checkNeedsApproval(allowance as bigint | undefined, yieldFormData.amount) : false;

  const handleApprove = async () => {
    if (!address || !yieldFormData.amount) return;
    
    try {
      setApprovalStep('approve');
      await approveToken({
        tokenAddress: yieldFormData.tokenAddress,
        amount: yieldFormData.amount,
        userAddress: address as `0x${string}`
      });
      await refetchAllowance();
      setApprovalStep('deposit');
    } catch (error) {
      setApprovalStep('check');
      alert(error instanceof Error ? error.message : 'Failed to approve token');
    }
  };

  const handleYieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!yieldFormData.seriesId || !yieldFormData.periodId || !yieldFormData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if approval is needed
    if (needsApproval && approvalStep !== 'deposit') {
      await handleApprove();
      return;
    }

    try {
      setApprovalStep('deposit');
      await depositYield(yieldFormData);
      setApprovalStep('check');
    } catch (error) {
      setApprovalStep('check');
      alert(error instanceof Error ? error.message : 'Failed to deposit yield');
    }
  };

  const handleYieldInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setYieldFormData(prev => ({
      ...prev,
      [name]: name === 'tokenAddress' ? value as `0x${string}` : value
    }));
    
    // Reset approval step when form changes
    if (name === 'amount' || name === 'tokenAddress') {
      setApprovalStep('check');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Create YRT Series</h1>
          <p className="text-gray-400">Create a new Yield-bearing Real Estate Token (YRT) series for property tokenization</p>
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
            Fill Sample Data (Sudirman Residence)
          </Button>
        </div>

        {/* Form */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Token Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-white">Token Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., YRT Sudirman"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token Symbol
                  </label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder="e.g., YRT-SDR"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sudirman Residence"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Economic Parameters */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="w-5 h-5 text-teal-500" />
                <h3 className="text-lg font-semibold text-white">Economic Parameters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Supply
                  </label>
                  <input
                    type="number"
                    name="initialSupply"
                    value={formData.initialSupply}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Set to 0 for unlimited minting during sale periods</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token Price (in underlying token)
                  </label>
                  <input
                    type="number"
                    name="tokenPrice"
                    value={formData.tokenPrice}
                    onChange={handleInputChange}
                    placeholder="1.0"
                    step="0.000001"
                    min="0"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Price per YRT token</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Underlying Token
                  </label>
                  <select
                    name="underlyingToken"
                    value={formData.underlyingToken}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-teal-500 focus:outline-none"
                    required
                  >
                    <option value={CONTRACTS.USDC}>USDC</option>
                    <option value={CONTRACTS.IDRX}>IDRX</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Token used for purchases and yield distributions</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fundraising Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="fundraisingDuration"
                    value={formData.fundraisingDuration || ''}
                    onChange={handleInputChange}
                    placeholder="180"
                    step="1"
                    min="1"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Duration for token sale period (180s = 3 minutes demo)</p>
                </div>
              </div>
            </div>

            {/* Transaction Status */}
            {(hash || error) && (
              <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
                {hash && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">Transaction Hash:</p>
                    <p className="text-xs font-mono text-teal-400 break-all">{hash}</p>
                  </>
                )}
                {isLoading && (
                  <p className="text-sm text-yellow-400 mt-2">⏳ Confirming transaction...</p>
                )}
                {isSuccess && (
                  <p className="text-sm text-green-400 mt-2">✅ YRT Series created successfully!</p>
                )}
                {error && (
                  <p className="text-sm text-red-400 mt-2">❌ Error: {error.message}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isLoading || !address || !isFormValid()}
                className="bg-teal-500 hover:bg-teal-600 text-black font-medium px-8 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create YRT Series</span>
                  </>
                )}
              </Button>
            </div>

            {!address && (
              <p className="text-center text-red-400 text-sm">
                Please connect your wallet to create a YRT series
              </p>
            )}
          </form>
        </div>

        {/* Start New Period Form */}
        <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">Start New Period</h3>
          </div>
          
          <form onSubmit={handlePeriodSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Series ID
                </label>
                <input
                  type="text"
                  name="seriesId"
                  value={periodFormData.seriesId}
                  onChange={handlePeriodInputChange}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">ID of the YRT series to start period for</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  name="durationInSeconds"
                  value={periodFormData.durationInSeconds || ''}
                  onChange={handlePeriodInputChange}
                  placeholder="300"
                  step="1"
                  min="1"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Period duration (300s = 5 minutes demo)</p>
              </div>
            </div>

            {/* Period Transaction Status */}
            {(periodHash || periodError) && (
              <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
                {periodHash && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">Period Transaction Hash:</p>
                    <p className="text-xs font-mono text-blue-400 break-all">{periodHash}</p>
                  </>
                )}
                {isPeriodLoading && (
                  <p className="text-sm text-yellow-400 mt-2">⏳ Starting new period...</p>
                )}
                {isPeriodSuccess && (
                  <p className="text-sm text-green-400 mt-2">✅ New period started successfully!</p>
                )}
                {periodError && (
                  <p className="text-sm text-red-400 mt-2">❌ Error: {periodError.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPeriodLoading || !address}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPeriodLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Start New Period</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Deposit Yield Form */}
        <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
          <div className="flex items-center space-x-2 mb-6">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-white">Deposit Yield</h3>
          </div>
          
          <form onSubmit={handleYieldSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Series ID
                </label>
                <input
                  type="text"
                  name="seriesId"
                  value={yieldFormData.seriesId}
                  onChange={handleYieldInputChange}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">YRT series ID</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Period ID
                </label>
                <input
                  type="text"
                  name="periodId"
                  value={yieldFormData.periodId}
                  onChange={handleYieldInputChange}
                  placeholder="e.g., 1"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Period ID to deposit yield for</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token
                </label>
                <select
                  name="tokenAddress"
                  value={yieldFormData.tokenAddress}
                  onChange={handleYieldInputChange}
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white focus:border-green-500 focus:outline-none"
                  required
                >
                  <option value={CONTRACTS.USDC}>USDC</option>
                  <option value={CONTRACTS.IDRX}>IDRX</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Token to deposit as yield</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={yieldFormData.amount}
                  onChange={handleYieldInputChange}
                  placeholder="e.g., 100"
                  step="0.000001"
                  min="0"
                  className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {needsApproval ? '⚠️ Approval required' : '✅ Sufficient allowance'}
                </p>
              </div>
            </div>

            {/* Yield Transaction Status */}
            {(yieldHash || yieldError) && (
              <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
                {yieldHash && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">Yield Transaction Hash:</p>
                    <p className="text-xs font-mono text-green-400 break-all">{yieldHash}</p>
                  </>
                )}
                {isYieldLoading && (
                  <p className="text-sm text-yellow-400 mt-2">⏳ Depositing yield...</p>
                )}
                {isYieldSuccess && (
                  <p className="text-sm text-green-400 mt-2">✅ Yield deposited successfully!</p>
                )}
                {yieldError && (
                  <p className="text-sm text-red-400 mt-2">❌ Error: {yieldError.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isYieldLoading || !address || (!yieldFormData.amount)}
                className={`font-medium px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  needsApproval && approvalStep !== 'deposit' 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isYieldLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    <span>
                      {approvalStep === 'approve' ? 'Approving...' : 'Depositing...'}
                    </span>
                  </>
                ) : (
                  <>
                    {needsApproval && approvalStep !== 'deposit' ? (
                      <>
                        <DollarSign className="w-4 h-4" />
                        <span>Approve Token</span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4" />
                        <span>Deposit Yield</span>
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">What happens after creation?</h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-black rounded-full flex items-center justify-center text-xs font-semibold">1</span>
              <p>A new YRT token contract will be deployed for your property</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-black rounded-full flex items-center justify-center text-xs font-semibold">2</span>
              <p>You can start new periods with maturity dates for quarterly distributions</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-black rounded-full flex items-center justify-center text-xs font-semibold">3</span>
              <p>Investors can purchase YRT tokens during active periods</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-black rounded-full flex items-center justify-center text-xs font-semibold">4</span>
              <p>Deposit yield for each period and distribute to token holders automatically</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}