import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

type TokenType = 'YRT' | 'USDC';

interface TokenInputProps {
  label: string;
  tokenType: TokenType;
  amount: string;
  onTokenChange: (value: TokenType) => void;
  onAmountChange: (value: string) => void;
  readOnly?: boolean;
  showSwapButton?: boolean;
  onSwap?: () => void;
  showApprovalWarning?: boolean;
  approvalTokens?: string[];
}

export function TokenInput({
  label,
  tokenType,
  amount,
  onTokenChange,
  onAmountChange,
  readOnly = false,
  showSwapButton = false,
  onSwap,
  showApprovalWarning = false,
  approvalTokens = []
}: TokenInputProps) {
  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          <select
            value={tokenType}
            onChange={(e) => onTokenChange(e.target.value as TokenType)}
            className="bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="USDC">USDC</option>
            <option value="YRT">YRT</option>
          </select>
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          step="0.000001"
          min="0"
          readOnly={readOnly}
          className={`w-full px-4 py-4 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white text-xl placeholder-gray-500 focus:border-blue-500 focus:outline-none ${
            readOnly ? 'cursor-not-allowed opacity-75' : ''
          }`}
          required={!readOnly}
        />
        {showApprovalWarning && approvalTokens.length > 0 && (
          <p className="text-xs text-yellow-400">
            ⚠️ Approval required: {approvalTokens.join(' & ')}
          </p>
        )}
      </div>

      {showSwapButton && onSwap && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={onSwap}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-800 p-2"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      )}
    </>
  );
}