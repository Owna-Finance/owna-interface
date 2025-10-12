interface YRTHolding {
  propertyName: string;
  balance: string;
  value: string;
  apy: string;
  location: string;
  type: string;
  performance: string;
}

interface PortfolioSummaryProps {
  yrtHoldings: YRTHolding[];
  totalYRTValue: number;
}

export function PortfolioSummary({ yrtHoldings, totalYRTValue }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-6 mb-10">
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-2">${totalYRTValue.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total YRT Value</div>
        </div>
      </div>
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">{yrtHoldings.length}</div>
          <div className="text-sm text-gray-400">Properties Owned</div>
        </div>
      </div>
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">+13.8%</div>
          <div className="text-sm text-gray-400">Portfolio Growth</div>
        </div>
      </div>
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-2">$2,847</div>
          <div className="text-sm text-gray-400">Monthly Yield</div>
        </div>
      </div>
    </div>
  );
}