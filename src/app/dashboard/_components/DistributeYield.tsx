import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DistributeFormData {
  seriesId: string;
  periodId: string;
}

interface DistributeYieldProps {
  distributeFormData: DistributeFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  distributeHash?: `0x${string}`;
  isDistributeLoading: boolean;
  isDistributeSuccess: boolean;
  distributeError: any;
  address: string | undefined;
}

export function DistributeYield({
  distributeFormData,
  onSubmit,
  onInputChange,
  distributeHash,
  isDistributeLoading,
  isDistributeSuccess,
  distributeError,
  address
}: DistributeYieldProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Send className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">Distribute to All Holders</h3>
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
                value={distributeFormData.seriesId}
                onChange={onInputChange}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">YRT series ID to distribute for</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Period ID
              </label>
              <input
                type="text"
                name="periodId"
                value={distributeFormData.periodId}
                onChange={onInputChange}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Period ID to distribute yield for</p>
            </div>
          </div>

          {(distributeHash || distributeError) && (
            <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
              {distributeHash && (
                <>
                  <p className="text-sm text-gray-400 mb-2">Distribution Transaction Hash:</p>
                  <p className="text-xs font-mono text-purple-400 break-all">{distributeHash}</p>
                </>
              )}
              {isDistributeLoading && (
                <p className="text-sm text-yellow-400 mt-2">⏳ Distributing to all holders...</p>
              )}
              {isDistributeSuccess && (
                <p className="text-sm text-green-400 mt-2">✅ Distribution completed successfully!</p>
              )}
              {distributeError && (
                <p className="text-sm text-red-400 mt-2">❌ Error: {distributeError.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isDistributeLoading || !address}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDistributeLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  <span>Distributing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Distribute to All Holders</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Additional Distribution Functions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
            <h4 className="text-white font-medium mb-2">Distribute to Specific Holders</h4>
            <p className="text-gray-400 text-sm">Coming soon - distribute yield to selected token holders</p>
          </div>
          <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
            <h4 className="text-white font-medium mb-2">Batch Distribution</h4>
            <p className="text-gray-400 text-sm">Coming soon - process distributions in batches</p>
          </div>
        </div>
      </div>
    </div>
  );
}