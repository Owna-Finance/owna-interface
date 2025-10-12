import { TokenInput } from './TokenInput';
import { SwapSettings } from './SwapSettings';
import { TransactionStatus } from './TransactionStatus';
import { SwapButton } from './SwapButton';

type TokenType = 'YRT' | 'USDC';
type SwapStep = 'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed';

interface SwapFormData {
  tokenFrom: TokenType;
  tokenTo: TokenType;
  amountFrom: string;
  amountTo: string;
  slippage: string;
  deadline: string;
  yrtAddress: string;
}

interface SwapFormProps {
  formData: SwapFormData;
  currentStep: SwapStep;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSwapTokens: () => void;
  needsYrtApproval: boolean;
  needsUsdcApproval: boolean;
  yrtApprovalHash?: `0x${string}`;
  usdcApprovalHash?: `0x${string}`;
  swapHash?: `0x${string}`;
  isTransactionConfirming: boolean;
  isPending: boolean;
  address: string | undefined;
}

export function SwapForm({
  formData,
  currentStep,
  onSubmit,
  onInputChange,
  onSwapTokens,
  needsYrtApproval,
  needsUsdcApproval,
  yrtApprovalHash,
  usdcApprovalHash,
  swapHash,
  isTransactionConfirming,
  isPending,
  address
}: SwapFormProps) {
  const approvalTokens = [];
  if (needsYrtApproval) approvalTokens.push('YRT');
  if (needsUsdcApproval) approvalTokens.push('USDC');

  return (
    <div className="bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            YRT Token Address
          </label>
          <input
            type="text"
            name="yrtAddress"
            value={formData.yrtAddress}
            onChange={onInputChange}
            placeholder="0x..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <TokenInput
          label="From"
          tokenType={formData.tokenFrom}
          amount={formData.amountFrom}
          onTokenChange={(value) => onInputChange({ target: { name: 'tokenFrom', value } } as any)}
          onAmountChange={(value) => onInputChange({ target: { name: 'amountFrom', value } } as any)}
          showApprovalWarning={needsYrtApproval || needsUsdcApproval}
          approvalTokens={approvalTokens}
          showSwapButton={true}
          onSwap={onSwapTokens}
        />

        <TokenInput
          label="To"
          tokenType={formData.tokenTo}
          amount={formData.amountTo}
          onTokenChange={(value) => onInputChange({ target: { name: 'tokenTo', value } } as any)}
          onAmountChange={() => {}}
          readOnly={true}
        />

        <SwapSettings
          slippage={formData.slippage}
          deadline={formData.deadline}
          onSlippageChange={(value) => onInputChange({ target: { name: 'slippage', value } } as any)}
          onDeadlineChange={(value) => onInputChange({ target: { name: 'deadline', value } } as any)}
        />

        <TransactionStatus
          currentStep={currentStep}
          yrtApprovalHash={yrtApprovalHash}
          usdcApprovalHash={usdcApprovalHash}
          swapHash={swapHash}
          isTransactionConfirming={isTransactionConfirming}
        />

        <SwapButton
          currentStep={currentStep}
          isPending={isPending}
          address={address}
          needsYrtApproval={needsYrtApproval}
          needsUsdcApproval={needsUsdcApproval}
        />
      </form>
    </div>
  );
}