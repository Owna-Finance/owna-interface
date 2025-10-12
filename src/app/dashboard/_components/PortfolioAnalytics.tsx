import { Info } from 'lucide-react';

export function PortfolioAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Property Distribution</h3>
          <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
        </div>
        
        <div className="flex items-center justify-center h-48 mb-6">
          <div className="relative">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2A2A" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="8" 
                strokeDasharray="188 251" strokeLinecap="round" className="transition-all duration-1000"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="8" 
                strokeDasharray="63 251" strokeDashoffset="-188" strokeLinecap="round" className="transition-all duration-1000"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">100%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-sm text-gray-300">Hotels</span>
            </div>
            <span className="text-sm font-medium text-white">75%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-300">Educational</span>
            </div>
            <span className="text-sm font-medium text-white">25%</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Yield & Performance</h3>
          <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-white mb-2">7.9%</div>
          <div className="text-sm text-gray-400">Average APY</div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm text-gray-300">Total Gains</span>
            </div>
            <span className="text-sm font-medium text-green-400">+$5,624</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-sm text-gray-300">Monthly Yield</span>
            </div>
            <span className="text-sm font-medium text-yellow-400">$2,847</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="text-sm text-gray-300">Property Appreciation</span>
            </div>
            <span className="text-sm font-medium text-purple-400">+8.5%</span>
          </div>
        </div>
      </div>
    </div>
  );
}