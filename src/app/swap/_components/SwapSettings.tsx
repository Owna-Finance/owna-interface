interface SwapSettingsProps {
  slippage: string;
  deadline: string;
  onSlippageChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
}

export function SwapSettings({
  slippage,
  deadline,
  onSlippageChange,
  onDeadlineChange
}: SwapSettingsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Slippage (%)
        </label>
        <input
          type="number"
          value={slippage}
          onChange={(e) => onSlippageChange(e.target.value)}
          placeholder="1"
          step="0.1"
          min="0.1"
          max="50"
          className="w-full px-3 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Deadline (min)
        </label>
        <input
          type="number"
          value={deadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
          placeholder="20"
          step="1"
          min="1"
          className="w-full px-3 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
    </div>
  );
}