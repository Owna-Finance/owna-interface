import { ArrowUpDown, Circle, Loader2 } from 'lucide-react';
import { Order } from '@/hooks';
import { formatUnits } from 'viem';

interface OffersTableProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export function OffersTable({ orders, isLoading, error }: OffersTableProps) {
  const formatTokenAmount = (amount: string, decimals: number = 18) => {
    try {
      const formatted = formatUnits(BigInt(amount), decimals);
      return parseFloat(formatted).toFixed(6);
    } catch {
      return '0.000000';
    }
  };

  const getTokenSymbol = (address: string) => {
    if (address.toLowerCase() === '0x70667aea00Fc7f087D6bFFB9De3eD95Af37140a4'.toLowerCase()) {
      return 'USDC';
    }
    return 'YRT';
  };

  const offerOrders = orders.filter(order => 
    getTokenSymbol(order.makerToken) === 'USDC' && getTokenSymbol(order.takerToken) === 'YRT'
  );

  return (
    <>
      <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[#111111] text-xs font-medium text-gray-400 uppercase">
        <div className="flex items-center space-x-1">
          <span>Date</span>
        </div>
        <div className="text-center">ID</div>
        <div className="flex items-center justify-center space-x-1">
          <span>Discount</span>
          <ArrowUpDown className="w-3 h-3" />
        </div>
        <div className="flex items-center justify-center space-x-1">
          <Circle className="w-3 h-3" />
          <span>Available Funds</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <Circle className="w-3 h-3" />
          <span>YRT Size limit</span>
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-400">Loading offers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400">Failed to load offers</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
          </div>
        ) : offerOrders.length > 0 ? (
          offerOrders.map((order) => {
            const usdcAmount = formatTokenAmount(order.makerAmount, order.makerTokenDecimals);
            const yrtAmount = formatTokenAmount(order.takerAmount, order.takerTokenDecimals);
            const price = parseFloat(usdcAmount) / parseFloat(yrtAmount);
            
            return (
              <div key={order.id} className="grid grid-cols-5 gap-4 px-4 py-3 text-sm hover:bg-[#111111] transition-colors">
                <div className="text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</div>
                <div className="text-center text-white">{order.id}</div>
                <div className="text-center text-white">{((1 - price) * 100).toFixed(2)}%</div>
                <div className="text-center text-white flex items-center justify-center space-x-1">
                  <span>{usdcAmount}</span>
                  <Circle className="w-3 h-3 text-gray-400 fill-current" />
                </div>
                <div className="text-center text-white flex items-center justify-center space-x-1">
                  <span>{yrtAmount}</span>
                  <Circle className="w-3 h-3 text-gray-400 fill-current" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No active offers found</p>
            <p className="text-gray-500 text-sm mt-1">Make an offer to get started</p>
          </div>
        )}
      </div>
    </>
  );
}