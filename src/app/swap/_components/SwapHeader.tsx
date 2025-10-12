import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface SwapHeaderProps {
  onFillSampleData: () => void;
}

export function SwapHeader({ onFillSampleData }: SwapHeaderProps) {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Swap</h1>
        <p className="text-gray-400">Exchange tokens instantly</p>
      </div>

      <div className="mb-6 text-center">
        <Button
          type="button"
          onClick={onFillSampleData}
          variant="outline"
          className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Fill Sample Data
        </Button>
      </div>
    </>
  );
}