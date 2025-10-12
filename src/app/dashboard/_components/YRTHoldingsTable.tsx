import Image from 'next/image';

interface YRTHolding {
  propertyName: string;
  balance: string;
  value: string;
  apy: string;
  location: string;
  type: string;
  performance: string;
}

interface YRTHoldingsTableProps {
  yrtHoldings: YRTHolding[];
  totalYRTValue: number;
}

export function YRTHoldingsTable({ yrtHoldings, totalYRTValue }: YRTHoldingsTableProps) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden">
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-white">YRT Holdings</h3>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300 font-medium">
              Real Estate Tokens
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Value: ${totalYRTValue.toLocaleString()}</div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-7 gap-4 mb-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div>Property</div>
          <div className="text-right">Balance</div>
          <div className="text-right">Value</div>
          <div className="text-right">APY</div>
          <div className="text-right">Type</div>
          <div className="text-right">Location</div>
          <div className="text-right">Performance</div>
        </div>
        <div className="space-y-1">
          {yrtHoldings.map((holding, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 p-4 hover:bg-[#111111]/50 transition-colors rounded-lg border-b border-white/5 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                  <Image
                    src="/Images/Logo/logo_YRT.jpg"
                    alt="YRT Logo"
                    width={24}
                    height={24}
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{holding.propertyName}</div>
                  <div className="text-xs text-gray-500">Yogyakarta Real Estate</div>
                </div>
              </div>
              <div className="text-right text-white font-medium">{holding.balance}</div>
              <div className="text-right text-white font-medium">{holding.value}</div>
              <div className="text-right text-green-400 font-medium">{holding.apy}</div>
              <div className="text-right text-gray-400">{holding.type}</div>
              <div className="text-right text-gray-400">{holding.location}</div>
              <div className="text-right text-green-400 font-medium">{holding.performance}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}