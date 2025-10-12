'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useAddLiquidity } from '@/hooks';
import { AmountsSection } from './_components/AmountSection';
import { InformationPanel } from './_components/InformationPanel';
import { PageHeader } from './_components/PageHeader';
import { PropertyInformationSection } from './_components/PropertyInformation';
import { SampleDataButton } from './_components/SampleDataButton';
import { StatusPanel } from './_components/StatusPanel';
import { SubmitButton } from './_components/SubmitButton';
import { TokenPairSection } from './_components/TokenPair';
import { TransactionSettingsSection } from './_components/TransactionSettings';
import { AddLiquidityFormData, Address, CurrentStep } from './_components/types';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;

const calculateMinimumWithSlippage = (amount: string, slippage: string): string => {
  if (!amount || !slippage) {
    return '0';
  }

  const amountNum = Number(amount);
  const slippageNum = Number(slippage);

  if (Number.isNaN(amountNum) || Number.isNaN(slippageNum)) {
    return '0';
  }

  return (amountNum * (1 - slippageNum / 100)).toString();
};

const SAMPLE_DATA: Partial<AddLiquidityFormData> = {
  tokenA: '0x8DE41E5c1CB99a8658401058a0c685caFE06a886' as Address,
  amountADesired: '100',
  amountBDesired: '1000',
  slippage: '5',
  to: '0xebFACa8463E1c3495a09684137fEd7A4b4574179' as Address,
  propertyName: 'Sudirman Residence Pool',
  propertyOwner: '0xebFACa8463E1c3495a09684137fEd7A4b4574179' as Address,
};

export default function AddLiquidityPage() {
  const { address } = useAccount();
  const { addLiquidity, approveToken, useTokenAllowance, checkNeedsApproval, hash } = useAddLiquidity();

  const [formData, setFormData] = useState<AddLiquidityFormData>({
    tokenA: '' as Address,
    tokenB: CONTRACTS.USDC,
    amountADesired: '',
    amountBDesired: '',
    slippage: '5',
    to: (address || '') as Address,
    deadline: '20',
    propertyName: '',
    propertyOwner: (address || '') as Address,
  });

  const [currentStep, setCurrentStep] = useState<CurrentStep>('idle');
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const [liquidityHash, setLiquidityHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isTransactionConfirming, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: tokenAAllowance, refetch: refetchTokenAAllowance } = useTokenAllowance({
    tokenAddress: formData.tokenA,
    amount: formData.amountADesired || '0',
    userAddress: (address || ZERO_ADDRESS) as Address,
  });

  const { data: tokenBAllowance, refetch: refetchTokenBAllowance } = useTokenAllowance({
    tokenAddress: formData.tokenB,
    amount: formData.amountBDesired || '0',
    userAddress: (address || ZERO_ADDRESS) as Address,
  });

  const needsTokenAApproval = useMemo(() => {
    if (!formData.amountADesired || !address || !formData.tokenA) {
      return false;
    }

    if (tokenAAllowance === undefined) {
      return true;
    }

    return checkNeedsApproval(tokenAAllowance as bigint, formData.amountADesired);
  }, [address, checkNeedsApproval, formData.amountADesired, formData.tokenA, tokenAAllowance]);

  const needsTokenBApproval = useMemo(() => {
    if (!formData.amountBDesired || !address) {
      return false;
    }

    if (tokenBAllowance === undefined) {
      return true;
    }

    return checkNeedsApproval(tokenBAllowance as bigint, formData.amountBDesired);
  }, [address, checkNeedsApproval, formData.amountBDesired, tokenBAllowance]);

  const amountAMin = useMemo(
    () => calculateMinimumWithSlippage(formData.amountADesired, formData.slippage),
    [formData.amountADesired, formData.slippage],
  );

  const amountBMin = useMemo(
    () => calculateMinimumWithSlippage(formData.amountBDesired, formData.slippage),
    [formData.amountBDesired, formData.slippage],
  );

  useEffect(() => {
    if (isTransactionSuccess && hash) {
      if (currentStep === 'approving-token-a') {
        setApprovalHash(hash);
        setCurrentStep('token-a-approved');
        refetchTokenAAllowance();
      } else if (currentStep === 'approving-token-b') {
        setApprovalHash(hash);
        setCurrentStep('tokens-approved');
        refetchTokenBAllowance();
      } else if (currentStep === 'adding-liquidity') {
        setLiquidityHash(hash);
        setCurrentStep('completed');
      }
    }
  }, [currentStep, hash, isTransactionSuccess, refetchTokenAAllowance, refetchTokenBAllowance]);

  const handleApproveTokenA = async () => {
    if (!address || !formData.amountADesired || !formData.tokenA) {
      return false;
    }

    try {
      setCurrentStep('approving-token-a');
      await approveToken({
        tokenAddress: formData.tokenA,
        amount: formData.amountADesired,
        userAddress: address as Address,
      });
      return true;
    } catch (error) {
      setCurrentStep('idle');
      alert(error instanceof Error ? error.message : 'Failed to approve Token A (YRT)');
      return false;
    }
  };

  const handleApproveTokenB = async () => {
    if (!address || !formData.amountBDesired) {
      return false;
    }

    try {
      setCurrentStep('approving-token-b');
      await approveToken({
        tokenAddress: formData.tokenB,
        amount: formData.amountBDesired,
        userAddress: address as Address,
      });
      return true;
    } catch (error) {
      setCurrentStep('idle');
      const tokenName = formData.tokenB === CONTRACTS.USDC ? 'USDC' : 'IDRX';
      alert(error instanceof Error ? error.message : `Failed to approve ${tokenName}`);
      return false;
    }
  };

  const handleAddLiquidity = async () => {
    if (!address) {
      return;
    }

    try {
      setCurrentStep('adding-liquidity');
      await addLiquidity({
        tokenA: formData.tokenA,
        tokenB: formData.tokenB,
        amountADesired: formData.amountADesired,
        amountBDesired: formData.amountBDesired,
        amountAMin,
        amountBMin,
        to: address as Address,
        deadline: formData.deadline,
        propertyName: formData.propertyName,
        propertyOwner: formData.propertyOwner,
      });
    } catch (error) {
      setCurrentStep('idle');
      alert(error instanceof Error ? error.message : 'Failed to add liquidity');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (
      !formData.tokenA ||
      !formData.amountADesired ||
      !formData.amountBDesired ||
      !formData.propertyName ||
      !formData.propertyOwner
    ) {
      alert('Please fill in all required fields');
      return;
    }

    if (needsTokenAApproval && currentStep === 'idle') {
      const approvalSuccess = await handleApproveTokenA();
      if (!approvalSuccess) {
        return;
      }
      return;
    }

    if (needsTokenBApproval && currentStep === 'token-a-approved') {
      const approvalSuccess = await handleApproveTokenB();
      if (!approvalSuccess) {
        return;
      }
      return;
    }

    if (currentStep === 'tokens-approved' || (!needsTokenAApproval && !needsTokenBApproval)) {
      await handleAddLiquidity();
      return;
    }

    if (!needsTokenAApproval && needsTokenBApproval && currentStep === 'idle') {
      const approvalSuccess = await handleApproveTokenB();
      if (!approvalSuccess) {
        return;
      }
      return;
    }

    if (needsTokenAApproval && !needsTokenBApproval && currentStep === 'token-a-approved') {
      await handleAddLiquidity();
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'tokenA' || name === 'tokenB' || name === 'to' || name === 'propertyOwner'
          ? (value as Address)
          : value,
    }));

    if (name === 'amountADesired' || name === 'amountBDesired' || name === 'tokenB') {
      setCurrentStep('idle');
      setApprovalHash(undefined);
      setLiquidityHash(undefined);
    }
  };

  const fillSampleData = () => {
    setFormData((prev) => ({
      ...prev,
      ...SAMPLE_DATA,
    }));
  };

  const hasAddress = Boolean(address);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <PageHeader />

        <div className="mb-6">
          <SampleDataButton onClick={fillSampleData} />
        </div>

        <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <TokenPairSection formData={formData} onChange={handleInputChange} />
            <AmountsSection
              formData={formData}
              onChange={handleInputChange}
              amountAMin={amountAMin}
              amountBMin={amountBMin}
              needsTokenAApproval={needsTokenAApproval}
              needsTokenBApproval={needsTokenBApproval}
            />
            <TransactionSettingsSection formData={formData} onChange={handleInputChange} />
            <PropertyInformationSection formData={formData} onChange={handleInputChange} />
            <StatusPanel
              approvalHash={approvalHash}
              liquidityHash={liquidityHash}
              currentStep={currentStep}
              needsTokenAApproval={needsTokenAApproval}
              needsTokenBApproval={needsTokenBApproval}
              isTransactionConfirming={isTransactionConfirming}
              formData={formData}
            />
            <div className="flex justify-end pt-6">
              <SubmitButton
                currentStep={currentStep}
                needsTokenAApproval={needsTokenAApproval}
                needsTokenBApproval={needsTokenBApproval}
                hasAddress={hasAddress}
                formData={formData}
              />
            </div>
            {!hasAddress && <p className="text-center text-red-400 text-sm">Please connect your wallet to add liquidity</p>}
          </form>
        </div>

        <InformationPanel />
      </div>
    </DashboardLayout>
  );
}
