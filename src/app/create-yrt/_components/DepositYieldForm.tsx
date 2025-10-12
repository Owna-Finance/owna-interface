import { Button } from '@/components/ui/button';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { DollarSign } from 'lucide-react';

interface YieldFormData {
  seriesId: string;
  periodId: string;
  amount: string;
  tokenAddress: `0x${string}`;
}

interface DepositYieldFormProps {
  yieldFormData: YieldFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  needsApproval: boolean;
  approvalStep: 'check' | 'approve' | 'deposit';
  yieldHash?: `0x${string}`;
  isYieldLoading: boolean;
  isYieldSuccess: boolean;
  yieldError: any;
  address: string | undefined;
}

export function DepositYieldForm({
  yieldFormData,
  onSubmit,
  onInputChange,
  needsApproval,
  approvalStep,
  yieldHash,
  isYieldLoading,
  isYieldSuccess,
  yieldError,
  address
}: DepositYieldFormProps) {
  return (
    <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
      <div className="flex items-center space-x-2 mb-6">
        <DollarSign className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-white">Deposit Yield</h3>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Series ID
            </label>
            <input
              type="text"
              name="seriesId"
              value={yieldFormData.seriesId}
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
  );
}