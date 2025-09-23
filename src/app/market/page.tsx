'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MOCK_LENDING_MARKETS, formatCurrency } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('supply');
  const [hideZeroBalance, setHideZeroBalance] = useState(false);
  const [showNetworks, setShowNetworks] = useState(true);
  const [showCategories, setShowCategories] = useState(true);

  // Filter yield-bearing tokens for market display
  const yieldBearingTokens = MOCK_LENDING_MARKETS.filter(market => 
    market.tokenId.startsWith('yrt-')
  );

  // Mock user positions (empty for now)
  const userPositions = yieldBearingTokens.map(market => ({
    ...market,
    userBalance: 0.00,
    userPositionValue: 0.00
  }));

  const supplyAPY = '0%';
  const borrowAPY = '0%';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">Market</h1>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-sm">
              <label className="flex items-center space-x-3 cursor-pointer bg-[#1A1A1A]/40 px-4 py-2 rounded-xl border border-[#2A2A2A]/50 transition-all duration-300 hover:bg-[#2A2A2A]/50">
                <input 
                  type="checkbox" 
                  checked={hideZeroBalance}
                  onChange={(e) => setHideZeroBalance(e.target.checked)}
                  className="rounded border-[#3A3A3A] bg-[#2A2A2A] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="text-gray-300 font-medium">Hide zero balance</span>
              </label>
            </div>
            <div className="flex items-center space-x-3 text-sm bg-[#1A1A1A]/40 px-4 py-2 rounded-xl border border-[#2A2A2A]/50">
              <span className="text-gray-300 font-medium">Networks</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNetworks(!showNetworks)}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50 transition-colors"
              >
                {showNetworks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <ChevronDown className="w-4 h-4 text-gray-400 hover:text-gray-200 transition-colors" />
            </div>
            <div className="flex items-center space-x-3 text-sm bg-[#1A1A1A]/40 px-4 py-2 rounded-xl border border-[#2A2A2A]/50">
              <span className="text-gray-300 font-medium">Categories</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCategories(!showCategories)}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50 transition-colors"
              >
                {showCategories ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <ChevronDown className="w-4 h-4 text-gray-400 hover:text-gray-200 transition-colors" />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Earn</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Supply APY</span>
                <span className="text-sm font-medium text-white">{supplyAPY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Positions</span>
                <span className="text-sm font-medium text-white">$0.00</span>
              </div>
            </div>
          </div>

          {/* Position Summary */}
          <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Position Summary</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Borrow APY</span>
                <span className="text-sm font-medium text-white">{borrowAPY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Positions</span>
                <span className="text-sm font-medium text-white">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="bg-[#1A1A1A]/40 backdrop-blur-sm rounded-2xl p-2 border border-[#2A2A2A]/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] inline-flex">
            <button
              onClick={() => setActiveTab('supply')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'supply'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Supply pools
            </button>
            <button
              onClick={() => setActiveTab('borrow')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'borrow'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Borrow pools
            </button>
          </div>
        </div>

        {/* Market Table */}
        <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center space-x-2">
                      <span>Assets</span>
                      <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                    </div>
                  </th>
                  <th className="text-right p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-end space-x-2">
                      <span>Positions</span>
                      <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                    </div>
                  </th>
                  <th className="text-right p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-end space-x-2">
                      <span>TVL</span>
                      <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                    </div>
                  </th>
                  <th className="text-right p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-end space-x-2">
                      <span>APY</span>
                      <Info className="w-3 h-3 hover:text-gray-200 transition-colors" />
                      <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                    </div>
                  </th>
                  <th className="text-right p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-end space-x-2">
                      <span>Bonus</span>
                      <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                    </div>
                  </th>
                  <th className="text-center p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Collateral asset</span>
                    </div>
                  </th>
                  <th className="text-center p-6 text-sm font-medium text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Borrow asset</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {userPositions.map((position) => (
                  <tr 
                    key={position.tokenId}
                    className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 cursor-pointer transition-all duration-200"
                  >
                    <td className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                            <span className="text-white text-sm font-bold">
                              {position.token.symbol.slice(3, 4).toUpperCase()}
                            </span>
                          </div>
                          {/* Token-specific styling */}
                          {position.tokenId === 'yrt-usdt' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                          {position.tokenId === 'yrt-base' && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{position.token.symbol}</div>
                          <div className="text-sm text-gray-400">{position.token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-sm font-medium text-white">
                        {position.userBalance.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        ${position.userPositionValue.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-sm font-medium text-white">
                        {formatCurrency(position.totalSupplied).replace('$', '')}M
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-sm font-medium text-blue-400 bg-blue-400/10 px-3 py-1 rounded-lg inline-block">
                        {activeTab === 'supply' 
                          ? `${position.supplyAPY.toFixed(2)}%`
                          : `${position.borrowAPY.toFixed(2)}%`
                        }
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="text-sm font-medium text-gray-500">-</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.3)]" />
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center">
                        {position.tokenId === 'yrt-usdc' || position.tokenId === 'yrt-usdt' || position.tokenId === 'yrt-base' ? 
                          <CheckCircle className="w-5 h-5 text-green-400 drop-shadow-[0_0_4px_rgba(34,197,94,0.3)]" /> : 
                          <XCircle className="w-5 h-5 text-red-400 drop-shadow-[0_0_4px_rgba(239,68,68,0.3)]" />
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}