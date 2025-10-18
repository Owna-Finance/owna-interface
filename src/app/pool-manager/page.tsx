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
import Image from 'next/image';

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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="text-center py-12 sm:py-16">
              <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-gray-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Connect Your Wallet</h2>
              <p className="text-gray-400 text-base sm:text-lg px-4">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Pool Management</h1>
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
                  Manage YRT series, liquidity pools, and yield distribution
                </p>
              </div>
              <Button
                onClick={handleSwitchChain}
                disabled={isSwitchingChain || isBaseSepolia(chainId)}
                variant={isBaseSepolia(chainId) ? "outline" : "default"}
                className={`${isBaseSepolia(chainId) ? "border-gray-400/30 text-black bg-gray-200 hover:bg-gray-300" : ""} w-full sm:w-auto`}
              >
                {isSwitchingChain ? (
                  'Switching...'
                ) : isBaseSepolia(chainId) ? (
                  <div className="flex items-center space-x-2">
                    <Image 
                      src="/Images/Logo/base-logo.png" 
                      alt="Base Logo" 
                      width={16} 
                      height={16} 
                      className="rounded-sm"
                    />
                    <span>Base Sepolia</span>
                  </div>
                ) : (
                  'Switch Network'
                )}
              </Button>
            </div>
          </div>

          {/* Chain Warning */}
          {!isBaseSepolia(chainId) && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-yellow-500 font-semibold text-sm sm:text-base">
                    Wrong Network Detected
                  </p>
                  <p className="text-yellow-600 text-xs sm:text-sm mt-1">
                    Please switch to {CHAIN.name} (Chain ID: {CHAIN.id}) to manage pools
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
            <TabsList className="bg-[#1A1A1A]/40 backdrop-blur-sm border border-[#2A2A2A]/50 p-1.5 sm:p-2 rounded-2xl grid w-full grid-cols-5 sm:grid-cols-5 gap-1 sm:gap-2 overflow-x-auto">
              <TabsTrigger
                value="overview"
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm"
              >
                <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline font-medium">Overview</span>
              </TabsTrigger>

              <TabsTrigger
                value="periods"
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline font-medium">Periods</span>
              </TabsTrigger>

              <TabsTrigger
                value="liquidity"
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm"
              >
                <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline font-medium">Liquidity</span>
              </TabsTrigger>

              <TabsTrigger
                value="yield"
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm"
              >
                <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline font-medium">Yield</span>
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="flex items-center justify-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline font-medium">Settings</span>
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
