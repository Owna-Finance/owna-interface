'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { Plus, Building, DollarSign, Calendar } from 'lucide-react';
import { useCreateYRT, useYRTForm } from '@/hooks';

export default function CreateYRTPage() {
  const { address } = useAccount();
  const { formData, handleInputChange, fillSampleData, isFormValid } = useYRTForm();
  const { createYRTSeries, hash, isLoading, isSuccess, error } = useCreateYRT();

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