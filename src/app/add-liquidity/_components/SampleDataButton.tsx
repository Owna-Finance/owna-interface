import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SampleDataButtonProps = {
  onClick: () => void;
};

export function SampleDataButton({ onClick }: SampleDataButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="outline"
      className="border-gray-600 text-gray-600 hover:bg-gray-800 hover:text-white cursor-pointer"
    >
      <Plus className="w-4 h-4 mr-2" />
      Fill Sample Data
    </Button>
  );
}
