'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MOCK_LENDING_MARKETS, formatCurrency, formatPercentage } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hideZeroBalance}
                  onChange={(e) => setHideZeroBalance(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-gray-600">Hide zero balance</span>
              </label>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Networks</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNetworks(!showNetworks)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showNetworks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-600">Categories</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCategories(!showCategories)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showCategories ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Earn</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Supply APY</span>
                <span className="text-sm font-medium text-gray-900">{supplyAPY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Positions</span>
                <span className="text-sm font-medium text-gray-900">$0.00</span>
              </div>
            </div>
          </div>

          {/* Position Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Position Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Borrow APY</span>
                <span className="text-sm font-medium text-gray-900">{borrowAPY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Positions</span>
                <span className="text-sm font-medium text-gray-900">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('supply')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'supply'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Supply pools
          </button>
          <button
            onClick={() => setActiveTab('borrow')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'borrow'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Borrow pools
          </button>
        </div>

        {/* Market Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>Assets</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Positions</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center justify-end space-x-1">
                      <span>TVL</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center justify-end space-x-1">
                      <span>APY</span>
                      <Info className="w-3 h-3" />
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Bonus</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {userPositions.map((position, index) => (
                  <tr 
                    key={position.tokenId}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {position.token.symbol.slice(3, 4).toUpperCase()}
                            </span>
                          </div>
                          {/* Token-specific styling */}
                          {position.tokenId === 'yrt-usdt' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                          {position.tokenId === 'yrt-base' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{position.token.symbol}</div>
                          <div className="text-sm text-gray-500">{position.token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {position.userBalance.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${position.userPositionValue.toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(position.totalSupplied).replace('$', '')}M
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-medium text-pink-500">
                        {activeTab === 'supply' 
                          ? `${position.supplyAPY.toFixed(2)}%`
                          : `${position.borrowAPY.toFixed(2)}%`
                        }
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-medium text-gray-500">-</div>
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