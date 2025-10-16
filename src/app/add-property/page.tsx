'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount, useChainId } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useCreateYRT, useYRTForm, useStartNewPeriod, useCreatePool } from '@/hooks';
import { useState, useEffect } from 'react';
import { isBaseSepolia, switchToBaseSepolia } from '@/utils/chain-switch';
import { CHAIN } from '@/constants/chain';
import {
  CreateYRTHeader,
  CreateYRTForm,
  CreatePoolForm,
  StartNewPeriodForm,
  InformationPanel
} from './_components';

export default function AddPropertyPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  const { formData, handleInputChange, fillSampleData, isFormValid } = useYRTForm();
  const { createYRTSeries, hash, isLoading, isSuccess, error } = useCreateYRT();
  const { createPool, hash: poolHash, isLoading: isPoolLoading, isSuccess: isPoolSuccess, error: poolError } = useCreatePool();
  const { startNewPeriod, hash: periodHash, isLoading: isPeriodLoading, isSuccess: isPeriodSuccess, error: periodError } = useStartNewPeriod();
  
  const [periodFormData, setPeriodFormData] = useState({
    seriesId: '',
    durationInSeconds: 300 // 5 minutes default
  });

  // Pool form state
  const [poolFormData, setPoolFormData] = useState({
    yrtTokenAddress: '',
    tokenB: CONTRACTS.USDC,
    propertyName: '',
    propertyOwner: ''
  });

  const [createdYrtAddress, setCreatedYrtAddress] = useState<string>('');

  const handleSwitchChain = async () => {
    if (!address) return;

    setIsSwitchingChain(true);
    try {
      await switchToBaseSepolia();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to switch chain');
    } finally {
      setIsSwitchingChain(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!isBaseSepolia(chainId)) {
      alert(`Please switch to ${CHAIN.name} to continue`);
      await handleSwitchChain();
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

  
  // Pool form handlers
  const handlePoolInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPoolFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!poolFormData.yrtTokenAddress || !poolFormData.propertyName || !poolFormData.propertyOwner) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createPool({
        tokenA: poolFormData.yrtTokenAddress as `0x${string}`,
        tokenB: poolFormData.tokenB as `0x${string}`,
        propertyName: poolFormData.propertyName,
        propertyOwner: poolFormData.propertyOwner as `0x${string}`
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create DEX pool');
    }
  };

  const isPoolFormValid = () => {
    return poolFormData.yrtTokenAddress.trim() !== '' &&
           poolFormData.propertyName.trim() !== '' &&
           poolFormData.propertyOwner.trim() !== '';
  };

  // Auto-populate pool form after YRT creation
  useEffect(() => {
    if (isSuccess && hash) {
      // Simulate getting the deployed YRT token address (in real implementation,
      // this would come from the transaction receipt or events)
      // For now, we'll set a placeholder that the user can update
      setTimeout(() => {
        setCreatedYrtAddress("0x0000000000000000000000000000000000000000"); // Placeholder
        setPoolFormData(prev => ({
          ...prev,
          yrtTokenAddress: "0x0000000000000000000000000000000000000000", // Placeholder - user should update this
          propertyName: formData.propertyName,
          propertyOwner: address || ''
        }));
      }, 2000);
    }
  }, [isSuccess, hash, formData.propertyName, address]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Chain Warning */}
        {address && !isBaseSepolia(chainId) && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-yellow-500 font-medium text-sm">
                    Wrong Network Detected
                  </p>
                  <p className="text-yellow-600 text-xs">
                    Please switch to {CHAIN.name} (Chain ID: {CHAIN.id})
                  </p>
                </div>
              </div>
              <button
                onClick={handleSwitchChain}
                disabled={isSwitchingChain}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-black font-medium text-sm rounded-lg transition-colors"
              >
                {isSwitchingChain ? 'Switching...' : 'Switch Network'}
              </button>
            </div>
          </div>
        )}

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

        <CreatePoolForm
          formData={poolFormData}
          onSubmit={handlePoolSubmit}
          onInputChange={handlePoolInputChange}
          hash={poolHash}
          isLoading={isPoolLoading}
          isSuccess={isPoolSuccess}
          error={poolError}
          address={address}
          isFormValid={isPoolFormValid}
          createdYrtAddress={createdYrtAddress}
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

        <InformationPanel />
      </div>
    </DashboardLayout>
  );
}