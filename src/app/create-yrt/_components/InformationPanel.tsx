import { Calendar } from 'lucide-react';

export function InformationPanel() {
  return (
    <div className="mt-8 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">What happens after creation?</h3>
      </div>
      
      <div className="space-y-3 text-sm text-gray-400">
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-semibold">1</span>
          <p>A new YRT token contract will be deployed for your property</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-gray-300 text-black rounded-full flex items-center justify-center text-xs font-semibold">2</span>
          <p>You can start new periods with maturity dates for quarterly distributions</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
          <p>Investors can purchase YRT tokens during active periods</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="flex-shrink-0 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</span>
          <p>Deposit yield for each period and distribute to token holders automatically</p>
        </div>
      </div>
    </div>
  );
}