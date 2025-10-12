import Image from 'next/image';
import { Info } from 'lucide-react';

export function MarketHeader() {
  return (
    <>
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
          <Image
            src="/Images/Logo/logo_YRT.jpg"
            alt="YRT Logo"
            width={48}
            height={48}
            className="object-cover rounded-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-white">YRT Market</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">7-Day Sales</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">169</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">Avg Sales</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">24.03%</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">7-Day Volume</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-white">$859,870</div>
        </div>
      </div>
    </>
  );
}