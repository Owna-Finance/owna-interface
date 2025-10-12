import { Droplets } from 'lucide-react';

export function InformationPanel() {
  return (
    <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Droplets className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-white">How Adding Liquidity Works</h3>
      </div>

      <div className="space-y-3 text-sm text-gray-400">
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</span>
          <p>Approve YRT and USDC/IDRX tokens for the required amounts</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</span>
          <p>Tokens will be deposited into the liquidity pool</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
          <p>You will receive LP tokens representing your share of the pool</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</span>
          <p>Earn fees from trades that happen in your pool</p>
        </div>
      </div>
    </div>
  );
}
