import { Button } from '@/components/ui/button';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { AddLiquidityFormData, CurrentStep } from './types';

type SubmitButtonProps = {
  currentStep: CurrentStep;
  needsTokenAApproval: boolean;
  needsTokenBApproval: boolean;
  hasAddress: boolean;
  formData: AddLiquidityFormData;
};

export function SubmitButton({ currentStep, needsTokenAApproval, needsTokenBApproval, hasAddress, formData }: SubmitButtonProps) {
  const isProcessing = currentStep.includes('approving') || currentStep === 'adding-liquidity';
  const tokenBLabel = formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX';

  const buttonText = (() => {
    // Transaction completed
    if (currentStep === 'completed') {
      return 'Completed!';
    }

    // Processing states
    if (isProcessing) {
      if (currentStep === 'approving-token-a') {
        return 'Approving YRT...';
      }
      if (currentStep === 'approving-token-b') {
        return `Approving ${tokenBLabel}...`;
      }
      if (currentStep === 'adding-liquidity') {
        return 'Adding Liquidity...';
      }
      return 'Processing...';
    }

    // Step 1: Need to approve YRT first
    if (needsTokenAApproval && currentStep === 'idle') {
      return 'Approve YRT';
    }

    // Step 2: YRT approved, need to approve Token B
    if (needsTokenBApproval && currentStep === 'token-a-approved') {
      return `Approve ${tokenBLabel}`;
    }

    // Step 2 (alternative): Only need Token B approval from start
    if (!needsTokenAApproval && needsTokenBApproval && currentStep === 'idle') {
      return `Approve ${tokenBLabel}`;
    }

    // Step 3: All approvals done or not needed, ready for liquidity
    if (currentStep === 'tokens-approved') {
      return 'Add Liquidity';
    }

    // Step 3 (alternative): YRT approved but Token B doesn't need approval
    if (!needsTokenBApproval && currentStep === 'token-a-approved') {
      return 'Add Liquidity';
    }

    // Step 3 (alternative): No approvals needed at all
    if (!needsTokenAApproval && !needsTokenBApproval && currentStep === 'idle') {
      return 'Add Liquidity';
    }

    // Default fallback
    return 'Add Liquidity';
  })();

  const isDisabled =
    (currentStep !== 'idle' && currentStep !== 'token-a-approved' && currentStep !== 'tokens-approved') ||
    !hasAddress;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className="bg-white hover:bg-gray-200 text-black font-medium rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <>
          <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
          <span className='disabled'>{buttonText}</span>
        </>
      ) : (
        <>
          <span />
          <span className='cursor-pointer'>{buttonText}</span>
        </>
      )}
    </Button>
  );
}
