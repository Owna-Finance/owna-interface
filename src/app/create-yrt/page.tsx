'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useCreateYRT, useYRTForm, useStartNewPeriod, useDepositYield } from '@/hooks';
import { useState } from 'react';
import {
  CreateYRTHeader,
  CreateYRTForm,
  StartNewPeriodForm,
  DepositYieldForm,
  InformationPanel
} from './_components';

export default function CreateYRTPage() {
  const { address } = useAccount();
  const { formData, handleInputChange, fillSampleData, isFormValid } = useYRTForm();
  const { createYRTSeries, hash, isLoading, isSuccess, error } = useCreateYRT();
  const { startNewPeriod, hash: periodHash, isLoading: isPeriodLoading, isSuccess: isPeriodSuccess, error: periodError } = useStartNewPeriod();
  const { depositYield, approveToken, useTokenAllowance, checkNeedsApproval, hash: yieldHash, isLoading: isYieldLoading, isSuccess: isYieldSuccess, error: yieldError } = useDepositYield();
  
  const [periodFormData, setPeriodFormData] = useState({
    seriesId: '',
    durationInSeconds: 300 // 5 minutes default
  });

  const [yieldFormData, setYieldFormData] = useState({
    seriesId: '',
    periodId: '',
    amount: '',
    tokenAddress: CONTRACTS.USDC as `0x${string}`
  });

  const [approvalStep, setApprovalStep] = useState<'check' | 'approve' | 'deposit'>('check');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createYRTSeries(formData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create YRT series');
    }
  };

  const handlePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!periodFormData.seriesId || !periodFormData.durationInSeconds) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await startNewPeriod(periodFormData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to start new period');
    }
  };

  const handlePeriodInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPeriodFormData(prev => ({
      ...prev,
      [name]: name === 'durationInSeconds' ? Number(value) : value
    }));
  };

  // Get allowance for the selected token
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance({
    tokenAddress: yieldFormData.tokenAddress,
    amount: yieldFormData.amount,
    userAddress: address as `0x${string}`
  });

  const needsApproval = yieldFormData.amount ? checkNeedsApproval(allowance as bigint | undefined, yieldFormData.amount) : false;

  const handleApprove = async () => {
    if (!address || !yieldFormData.amount) return;
    
    try {
      setApprovalStep('approve');
      await approveToken({
        tokenAddress: yieldFormData.tokenAddress,
        amount: yieldFormData.amount,
        userAddress: address as `0x${string}`
      });
      await refetchAllowance();
      setApprovalStep('deposit');
    } catch (error) {
      setApprovalStep('check');
      alert(error instanceof Error ? error.message : 'Failed to approve token');
    }
  };

  const handleYieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!yieldFormData.seriesId || !yieldFormData.periodId || !yieldFormData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if approval is needed
    if (needsApproval && approvalStep !== 'deposit') {
      await handleApprove();
      return;
    }

    try {
      setApprovalStep('deposit');
      await depositYield(yieldFormData);
      setApprovalStep('check');
    } catch (error) {
      setApprovalStep('check');
      alert(error instanceof Error ? error.message : 'Failed to deposit yield');
    }
  };

  const handleYieldInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setYieldFormData(prev => ({
      ...prev,
      [name]: name === 'tokenAddress' ? value as `0x${string}` : value
    }));
    
    if (name === 'amount' || name === 'tokenAddress') {
      setApprovalStep('check');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <CreateYRTHeader onFillSampleData={fillSampleData} />

        <CreateYRTForm
          formData={formData}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          hash={hash}
          isLoading={isLoading}
          isSuccess={isSuccess}
          error={error}
          address={address}
          isFormValid={isFormValid}
        />

        <StartNewPeriodForm
          periodFormData={periodFormData}
          onSubmit={handlePeriodSubmit}
          onInputChange={handlePeriodInputChange}
          periodHash={periodHash}
          isPeriodLoading={isPeriodLoading}
          isPeriodSuccess={isPeriodSuccess}
          periodError={periodError}
          address={address}
        />

        <DepositYieldForm
          yieldFormData={yieldFormData}
          onSubmit={handleYieldSubmit}
          onInputChange={handleYieldInputChange}
          needsApproval={needsApproval}
          approvalStep={approvalStep}
          yieldHash={yieldHash}
          isYieldLoading={isYieldLoading}
          isYieldSuccess={isYieldSuccess}
          yieldError={yieldError}
          address={address}
        />

        <InformationPanel />
      </div>
    </DashboardLayout>
  );
}