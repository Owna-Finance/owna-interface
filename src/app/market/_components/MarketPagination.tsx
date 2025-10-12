import { Button } from '@/components/ui/button';

interface MarketPaginationProps {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export function MarketPagination({
  currentPage,
  totalPages,
  totalOrders,
  setCurrentPage
}: MarketPaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-t border-gray-800">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          className="text-gray-400 text-sm disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          First
        </Button>
        <Button 
          variant="ghost" 
          className="text-gray-400 text-sm disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        >
          ‹
        </Button>
      </div>
      <div className="text-sm text-gray-400">
        {currentPage} of {totalPages > 0 ? totalPages : 1} ({totalOrders} total orders)
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          className="text-gray-400 text-sm disabled:opacity-50"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        >
          ›
        </Button>
        <Button 
          variant="ghost" 
          className="text-gray-400 text-sm disabled:opacity-50"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(totalPages)}
        >
          Last
        </Button>
      </div>
    </div>
  );
}