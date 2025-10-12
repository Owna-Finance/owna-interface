import { CONTRACTS } from '@/constants/contracts/contracts';
import { AddLiquidityFormData, CurrentStep } from './types';

type StatusPanelProps = {
  approvalHash?: `0x${string}`;
  liquidityHash?: `0x${string}`;
  currentStep: CurrentStep;
  needsTokenAApproval: boolean;
  needsTokenBApproval: boolean;
  isTransactionConfirming: boolean;
  formData: AddLiquidityFormData;
};

export function StatusPanel({
  approvalHash,
  liquidityHash,
  currentStep,
  needsTokenAApproval,
  needsTokenBApproval,
  isTransactionConfirming,
  formData,
}: StatusPanelProps) {
  const showPanel = approvalHash || liquidityHash || currentStep !== 'idle';

  if (!showPanel) {
    return null;
  }

  const tokenBLabel = formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX';

  const showTokenAStatus =
    approvalHash ||
    currentStep === 'approving-token-a' ||
    currentStep === 'token-a-approved' ||
    (currentStep !== 'idle' && needsTokenAApproval);

  const showTokenBStatus =
    approvalHash ||
    currentStep === 'approving-token-b' ||
    currentStep === 'tokens-approved' ||
    (currentStep !== 'idle' && needsTokenBApproval);

  const showLiquidityStatus =
    liquidityHash || currentStep === 'adding-liquidity' || currentStep === 'completed';

  return (
    <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg space-y-3">
      {showTokenAStatus && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-300">YRT Approval:</span>
            {currentStep === 'approving-token-a' && isTransactionConfirming && (
              <span className="text-xs text-yellow-400">⏳ Confirming...</span>
            )}
            {(currentStep === 'token-a-approved' ||
              currentStep === 'approving-token-b' ||
              currentStep === 'tokens-approved' ||
              currentStep === 'adding-liquidity' ||
              currentStep === 'completed') &&
              needsTokenAApproval && (
                <span className="text-xs text-green-400">✅ Approved</span>
              )}
            {!needsTokenAApproval && <span className="text-xs text-gray-400">Not required</span>}
          </div>
          {approvalHash && currentStep !== 'approving-token-b' && (
            <p className="text-xs font-mono text-blue-400 break-all">YRT: {approvalHash}</p>
          )}
        </div>
      )}

      {showTokenBStatus && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-300">{tokenBLabel} Approval:</span>
            {currentStep === 'approving-token-b' && isTransactionConfirming && (
              <span className="text-xs text-yellow-400">⏳ Confirming...</span>
            )}
            {(currentStep === 'tokens-approved' || currentStep === 'adding-liquidity' || currentStep === 'completed') &&
              needsTokenBApproval && (
                <span className="text-xs text-green-400">✅ Approved</span>
              )}
            {!needsTokenBApproval && <span className="text-xs text-gray-400">Not required</span>}
          </div>
          {approvalHash && currentStep === 'approving-token-b' && (
            <p className="text-xs font-mono text-blue-400 break-all">
              {tokenBLabel}: {approvalHash}
            </p>
          )}
        </div>
      )}

      {showLiquidityStatus && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-300">Add Liquidity:</span>
            {currentStep === 'adding-liquidity' && isTransactionConfirming && (
              <span className="text-xs text-yellow-400">⏳ Confirming...</span>
            )}
            {currentStep === 'completed' && (
              <span className="text-xs text-green-400">✅ Completed</span>
            )}
          </div>
          {liquidityHash && (
            <p className="text-xs font-mono text-blue-400 break-all">Liquidity: {liquidityHash}</p>
          )}
        </div>
      )}

      {currentStep === 'idle' && (needsTokenAApproval || needsTokenBApproval) && (
        <p className="text-sm text-yellow-400">
          {needsTokenAApproval && needsTokenBApproval
            ? 'YRT and token approvals required before adding liquidity'
            : needsTokenAApproval
            ? 'YRT approval required before adding liquidity'
            : `${tokenBLabel} approval required before adding liquidity`}
        </p>
      )}
    </div>
  );
}
