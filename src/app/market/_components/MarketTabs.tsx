import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MarketTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateOrder: (type: 'sell' | 'offer') => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function MarketTabs({ activeTab, setActiveTab, onCreateOrder, onRefresh, isRefreshing }: MarketTabsProps) {
  return (
    <div className="flex justify-between items-center mb-6 border-b border-gray-800">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'listings'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Listings
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-black hover:bg-gray-700 text-white font-medium px-3 py-2 rounded-lg mb-3 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
        
        <Button 
        onClick={() => onCreateOrder('sell')}
        className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-2 rounded-lg mb-3 flex items-center space-x-2 cursor-pointer"
      >
          <span>Sell</span>
        </Button>
      </div>
    </div>
  );
}