'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Wallet,
  Activity,
  TrendingUp
} from 'lucide-react';

// Import components
import {
  DashboardHeader,
  PortfolioSummary,
  PortfolioAnalytics,
  YRTHoldingsTable,
  ActivityHistory
} from './_components';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const { address } = useAccount();

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#222222]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4 text-lg">{error}</p>
              <Button
                onClick={() => { clearError(); loadPortfolio(); }}
                className="bg-white hover:bg-gray-200 text-black"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#222222]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <DashboardHeader />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 mt-8">
            <TabsList className="bg-[#1A1A1A]/40 backdrop-blur-sm border border-[#2A2A2A]/50 p-2 rounded-2xl inline-flex gap-2">
              <TabsTrigger
                value="portfolio"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-6 py-3 rounded-xl"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-medium">Portfolio</span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-6 py-3 rounded-xl"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-6 py-3 rounded-xl"
              >
                <Activity className="w-4 h-4" />
                <span className="font-medium">Activity</span>
              </TabsTrigger>
            </TabsList>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <PortfolioSummary />
              <YRTHoldingsTable title="Token Holdings" subtitle="YRT, USDC, IDRX Tokens" />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <PortfolioAnalytics />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <ActivityHistory />
            </TabsContent>
          </Tabs>

          {isLoading && !portfolio && (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" text="Loading your portfolio..." />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
