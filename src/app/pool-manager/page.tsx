'use client';

import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { isBaseSepolia, switchToBaseSepolia } from '@/utils/chain-switch';
import { CHAIN } from '@/constants/chain';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  Droplets,
  Gift,
  Settings,
  AlertCircle
} from 'lucide-react';

// Import tab components
import {
  OverviewTab,
  PeriodManagementTab,
  LiquidityManagementTab,
  YieldDistributionTab,
  PropertySettingsTab
} from './_components';

export default function PoolManagerPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);

  const handleSwitchChain = async () => {
    if (!address) return;
    setIsSwitchingChain(true);
    try {
      await switchToBaseSepolia();
    } catch (error) {
      toast.error('Failed to switch chain');
    } finally {
      setIsSwitchingChain(false);
    }
  };

  if (!address) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#222222]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="text-center py-16">
              <AlertCircle className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-3">Connect Your Wallet</h2>
              <p className="text-gray-400 text-lg">
                Please connect your wallet to manage pools and properties
              </p>
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Pool Management</h1>
                <p className="text-gray-400 text-lg">
                  Manage YRT series, liquidity pools, and yield distribution
                </p>
              </div>
              <Button
                onClick={handleSwitchChain}
                disabled={isSwitchingChain || isBaseSepolia(chainId)}
                variant={isBaseSepolia(chainId) ? "outline" : "default"}
                className={isBaseSepolia(chainId) ? "border-green-500/30 text-green-400" : ""}
              >
                {isSwitchingChain ? 'Switching...' : isBaseSepolia(chainId) ? 'Base Sepolia ✓' : 'Switch Network'}
              </Button>
            </div>
          </div>

          {/* Chain Warning */}
          {!isBaseSepolia(chainId) && (
            <div className="mb-8 p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-yellow-500 font-semibold text-base">
                    Wrong Network Detected
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Please switch to {CHAIN.name} (Chain ID: {CHAIN.id}) to manage pools
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-[#1A1A1A]/40 backdrop-blur-sm border border-[#2A2A2A]/50 p-2 rounded-2xl grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              <TabsTrigger
                value="overview"
                className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-4 py-3 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Overview</span>
              </TabsTrigger>

              <TabsTrigger
                value="periods"
                className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-4 py-3 rounded-xl"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Periods</span>
              </TabsTrigger>

              <TabsTrigger
                value="liquidity"
                className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-4 py-3 rounded-xl"
              >
                <Droplets className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Liquidity</span>
              </TabsTrigger>

              <TabsTrigger
                value="yield"
                className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-4 py-3 rounded-xl"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Yield</span>
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-4 py-3 rounded-xl"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="periods" className="space-y-6">
              <PeriodManagementTab />
            </TabsContent>

            <TabsContent value="liquidity" className="space-y-6">
              <LiquidityManagementTab />
            </TabsContent>

            <TabsContent value="yield" className="space-y-6">
              <YieldDistributionTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <PropertySettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
