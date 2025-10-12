import { Button } from '@/components/ui/button';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { Building, DollarSign, Plus } from 'lucide-react';

interface YRTFormData {
  name: string;
  symbol: string;
  propertyName: string;
  initialSupply: string;
  tokenPrice: string;
  underlyingToken: string;
  fundraisingDuration: number | '';
}

interface CreateYRTFormProps {
  formData: YRTFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  hash?: `0x${string}`;
  isLoading: boolean;
  isSuccess: boolean;
  error: any;
  address: string | undefined;
  isFormValid: () => boolean;
}

export function CreateYRTForm({
  formData,
  onSubmit,
  onInputChange,
  hash,
  isLoading,
  isSuccess,
  error,
  address,
  isFormValid
}: CreateYRTFormProps) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
      <form onSubmit={onSubmit} className="space-y-6">
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
              onChange={onInputChange}
              placeholder="e.g., Sudirman Residence"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
              required
            />
          </div>
        </div>

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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
  );
}