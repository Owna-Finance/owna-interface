'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LiquidityPoolTable, EnhancedSwapForm, PoolInformationPanel } from './_components';
import { useLiquidityPoolsData } from '@/hooks';

export default function DEXPage() {
  const [selectedPool, setSelectedPool] = useState<`0x${string}` | undefined>();
  const { pools, poolsLength } = useLiquidityPoolsData();

  const handlePoolSelect = (poolAddress: `0x${string}`) => {
    setSelectedPool(poolAddress);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Owna DEX</h1>
          <p className="text-gray-400">
            Trade property tokens instantly on our automated market maker
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Liquidity Pools Table */}
          <div className="lg:col-span-2">
            <LiquidityPoolTable
              onPoolSelect={handlePoolSelect}
              selectedPool={selectedPool}
            />
          </div>

          {/* Right Side - Swap Form & Pool Info */}
          <div className="space-y-6">
            {/* Swap Form */}
            <EnhancedSwapForm
              selectedPool={selectedPool}
              availablePools={pools}
            />

            {/* Pool Information Panel */}
            {selectedPool && (
              <PoolInformationPanel poolAddress={selectedPool} />
            )}

            {/* Quick Stats */}
            <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pools</span>
                  <span className="text-white font-medium">{poolsLength || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total TVL</span>
                  <span className="text-white font-medium">$250,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white font-medium">$45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Trades</span>
                  <span className="text-white font-medium">1,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* How it Works */}
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How it Works</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p>Select a liquidity pool from the table</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p>Choose tokens and amount to swap</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p>Set slippage tolerance and confirm swap</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p>Receive tokens instantly in your wallet</p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security & Fees</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Trading Fee</span>
                <span className="text-white font-medium">0.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Network</span>
                <span className="text-white font-medium">Base Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span>Audited</span>
                <span className="text-green-400 font-medium">✓ Yes</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance</span>
                <span className="text-green-400 font-medium">✓ Covered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}