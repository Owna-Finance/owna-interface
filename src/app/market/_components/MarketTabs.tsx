import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MarketTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateOrder: (type: 'sell' | 'offer') => void;
}

export function MarketTabs({ activeTab, setActiveTab, onCreateOrder }: MarketTabsProps) {
  return (
    <div className="flex justify-between items-center mb-6 border-b border-gray-800">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'listings'
              ? 'text-white border-b-2 border-teal-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Listings
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'offers'
              ? 'text-white border-b-2 border-teal-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Offers
        </button>
      </div>
      
      <Button 
        onClick={() => onCreateOrder(activeTab === 'listings' ? 'sell' : 'offer')}
        className="bg-teal-500 hover:bg-teal-600 text-black font-medium px-8 py-2 rounded-lg mb-3 flex items-center space-x-2"
      >
        {activeTab === 'listings' ? (
          <span>Sell</span>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Offer</span>
          </>
        )}
      </Button>
    </div>
  );
}