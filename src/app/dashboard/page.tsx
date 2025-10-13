'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { useDistributeToAllHolders } from '@/hooks';
import {
  DashboardHeader,
  DashboardTabs,
  PortfolioSummary,
  PortfolioAnalytics,
  YRTHoldingsTable,
  DistributeYield,
  ActivityHistory
} from './_components';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [distributeFormData, setDistributeFormData] = useState({
    seriesId: '',
    periodId: ''
  });
  
  const { address } = useAccount();
  const { distributeToAllHolders, hash: distributeHash, isLoading: isDistributeLoading, isSuccess: isDistributeSuccess, error: distributeError } = useDistributeToAllHolders();

  const {
    portfolio,
    isLoading,
    error,
    loadPortfolio,
    clearError
  } = usePortfolioStore();


  useEffect(() => {
    if (!portfolio) {
      loadPortfolio();
    }
  }, [portfolio, loadPortfolio]);

  const handleDistributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!distributeFormData.seriesId || !distributeFormData.periodId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await distributeToAllHolders(distributeFormData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to distribute to all holders');
    }
  };

  const handleDistributeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDistributeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => { clearError(); loadPortfolio(); }}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#222222]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <DashboardHeader 
            showWalletDropdown={showWalletDropdown}
            setShowWalletDropdown={setShowWalletDropdown}
          />

          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'portfolio' && (
            <>
              <PortfolioSummary />
              <PortfolioAnalytics />
              <YRTHoldingsTable title="Token Holdings" subtitle="YRT, USDC, IDRX Tokens" />
            </>
          )}

          {activeTab === 'distribute' && (
            <DistributeYield
              distributeFormData={distributeFormData}
              onSubmit={handleDistributeSubmit}
              onInputChange={handleDistributeInputChange}
              distributeHash={distributeHash}
              isDistributeLoading={isDistributeLoading}
              isDistributeSuccess={isDistributeSuccess}
              distributeError={distributeError}
              address={address}
            />
          )}

          {activeTab === 'activity' && <ActivityHistory />}

          {isLoading && !portfolio && (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" text="Loading YRT portfolio..." />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}