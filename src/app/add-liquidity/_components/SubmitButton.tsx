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
    if (currentStep === 'completed') {
      return 'Completed!';
    }

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

    if (needsTokenAApproval && currentStep === 'idle') {
      return 'Approve YRT & Add Liquidity';
    }

    if (needsTokenBApproval && currentStep === 'token-a-approved') {
      return `Approve ${tokenBLabel}`;
    }

    if (currentStep === 'tokens-approved') {
      return 'Add Liquidity';
    }

    if (!needsTokenAApproval && needsTokenBApproval && currentStep === 'idle') {
      return `Approve ${tokenBLabel} & Add Liquidity`;
    }

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
          <span>{buttonText}</span>
        </>
      ) : (
        <>
          <span />
          <span>{buttonText}</span>
        </>
      )}
    </Button>
  );
}
