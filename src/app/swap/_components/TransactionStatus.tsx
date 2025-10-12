type SwapStep = 'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed';

interface TransactionStatusProps {
  currentStep: SwapStep;
  yrtApprovalHash?: `0x${string}`;
  usdcApprovalHash?: `0x${string}`;
  swapHash?: `0x${string}`;
  isTransactionConfirming: boolean;
}

export function TransactionStatus({
  currentStep,
  yrtApprovalHash,
  usdcApprovalHash,
  swapHash,
  isTransactionConfirming
}: TransactionStatusProps) {
  const shouldShow = yrtApprovalHash || usdcApprovalHash || swapHash || currentStep !== 'idle';

  if (!shouldShow) return null;

  const showYrtSection = yrtApprovalHash || 
    ['approving-yrt', 'yrt-approved', 'approving-usdc', 'tokens-approved', 'swapping', 'completed'].includes(currentStep);
  
  const showUsdcSection = usdcApprovalHash || 
    ['approving-usdc', 'tokens-approved', 'swapping', 'completed'].includes(currentStep);
  
  const showSwapSection = swapHash || 
    ['swapping', 'completed'].includes(currentStep);

  return (
    <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg space-y-2">
      {showYrtSection && (
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-300">YRT Approval:</span>
            {currentStep === 'approving-yrt' && isTransactionConfirming && (
              <span className="text-xs text-yellow-400">⏳ Confirming...</span>
            )}
            {['yrt-approved', 'approving-usdc', 'tokens-approved', 'swapping', 'completed'].includes(currentStep) && (
              <span className="text-xs text-green-400">✅ Approved</span>
            )}
          </div>
          {yrtApprovalHash && (
            <p className="text-xs font-mono text-blue-400 break-all">
              {yrtApprovalHash}
            </p>
          )}
        </div>
      )}

      {showUsdcSection && (
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-300">USDC Approval:</span>
            {currentStep === 'approving-usdc' && isTransactionConfirming && (
              <span className="text-xs text-yellow-400">⏳ Confirming...</span>
            )}
            {['tokens-approved', 'swapping', 'completed'].includes(currentStep) && (
              <span className="text-xs text-green-400">✅ Approved</span>
            )}
          </div>
          {usdcApprovalHash && (
            <p className="text-xs font-mono text-blue-400 break-all">
              {usdcApprovalHash}
            </p>
          )}
        </div>
      )}

      {showSwapSection && (
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-300">Swap:</span>
            {currentStep === 'swapping' && isTransactionConfirming && (
              <span className="text-xs text-yellow-400">⏳ Confirming...</span>
            )}
            {currentStep === 'completed' && (
              <span className="text-xs text-green-400">✅ Completed</span>
            )}
          </div>
          {swapHash && (
            <p className="text-xs font-mono text-blue-400 break-all">
              {swapHash}
            </p>
          )}
        </div>
      )}
    </div>
  );
}