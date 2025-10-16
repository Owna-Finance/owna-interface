import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CreateYRTHeaderProps {
  onFillSampleData: () => void;
}

export function CreateYRTHeader({ onFillSampleData }: CreateYRTHeaderProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Add Property</h1>
        <p className="text-gray-400">Create a new property token (YRT), DEX pool, and start earning periods</p>
      </div>

      <div className="mb-6">
        <Button
          type="button"
          onClick={onFillSampleData}
          variant="outline"
          className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Fill Sample Data (Sudirman Residence)
        </Button>
      </div>
    </>
  );
}