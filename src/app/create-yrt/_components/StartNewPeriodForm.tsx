import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface PeriodFormData {
  seriesId: string;
  durationInSeconds: number | '';
}

interface StartNewPeriodFormProps {
  periodFormData: PeriodFormData;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  periodHash?: `0x${string}`;
  isPeriodLoading: boolean;
  isPeriodSuccess: boolean;
  periodError: any;
  address: string | undefined;
}

export function StartNewPeriodForm({
  periodFormData,
  onSubmit,
  onInputChange,
  periodHash,
  isPeriodLoading,
  isPeriodSuccess,
  periodError,
  address
}: StartNewPeriodFormProps) {
  useEffect(() => {
    if (isPeriodSuccess && periodHash) {
      toast.success('New period started successfully!', {
        description: (
          <p className="text-xs font-mono text-white break-all">
            <a
              href={`https://sepolia.basescan.org/tx/${periodHash}`}
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
  }, [isPeriodSuccess, periodHash]);

  useEffect(() => {
    if (periodError) {
      toast.error('Failed to start new period', {
        description: periodError.message
      });
    }
  }, [periodError]);
  return (
    <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Start New Period</h3>
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
              value={periodFormData.seriesId}
              onChange={onInputChange}
              placeholder="e.g., 1"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              onChange={onInputChange}
              placeholder="300"
              step="1"
              min="1"
              className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Period duration (300s = 5 minutes demo)</p>
          </div>
        </div>

        {(periodHash || periodError) && (
          <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
            {isPeriodSuccess && (
              <p className="text-sm text-white mb-1">
                New period started successfully!
              </p>
            )}
            {periodHash && (
              <>
                <p className="text-md font-mono text-white break-all">
                  <a
                    href={`https://sepolia.basescan.org/tx/${periodHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-4 h-4" /> <span>View On Explorer</span>
                  </a>
                </p>
              </>
            )}
            {isPeriodLoading && (
              <p className="text-sm text-gray-300 mt-2">⏳ Starting new period...</p>
            )}
            {periodError && (
              <p className="text-sm text-gray-300 mt-2">❌ Error: {periodError.message}</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
          disabled={isPeriodLoading || !address}
            className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPeriodLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span className='cursor-pointer'>Start New Period</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}