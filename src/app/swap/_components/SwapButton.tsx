import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

type SwapStep = 'idle' | 'approving-yrt' | 'yrt-approved' | 'approving-usdc' | 'tokens-approved' | 'swapping' | 'completed';

interface SwapButtonProps {
  currentStep: SwapStep;
  isPending: boolean;
  address: string | undefined;
  needsYrtApproval: boolean;
  needsUsdcApproval: boolean;
}

export function SwapButton({
  currentStep,
  isPending,
  address,
  needsYrtApproval,
  needsUsdcApproval
}: SwapButtonProps) {
  const isDisabled = isPending || !address || 
    !['idle', 'yrt-approved', 'tokens-approved'].includes(currentStep);

  const isProcessing = ['approving-yrt', 'approving-usdc', 'swapping'].includes(currentStep);

  const getButtonText = () => {
    if (currentStep === 'completed') return 'Completed!';
    if (needsYrtApproval && currentStep === 'idle') return 'Approve YRT';
    if (needsUsdcApproval && currentStep === 'yrt-approved') return 'Approve USDC';
    if (currentStep === 'tokens-approved') return 'Swap Tokens';
    if (!needsYrtApproval && needsUsdcApproval && currentStep === 'idle') return 'Approve USDC';
    return 'Swap Tokens';
  };

  const getProcessingText = () => {
    if (currentStep === 'approving-yrt') return 'Approving YRT...';
    if (currentStep === 'approving-usdc') return 'Approving USDC...';
    if (currentStep === 'swapping') return 'Swapping...';
    return 'Processing...';
  };

  return (
    <>
      <Button
        type="submit"
        disabled={isDisabled}
        className="cursor-pointer w-full bg-white hover:bg-gray-300 text-white font-medium py-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
            <span>{getProcessingText()}</span>
          </>
        ) : (
          <>
            <span className='cursor-pointer text-black'>{getButtonText()}</span>
          </>
        )}
      </Button>

      {!address && (
        <p className="text-center text-red-400 text-sm">
          Please connect your wallet to swap tokens
        </p>
      )}
    </>
  );
}