'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MOCK_LENDING_MARKETS, formatCurrency } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState('assets');
  const [hideZeroBalance, setHideZeroBalance] = useState(false);
  const [showNetworks, setShowNetworks] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [expandedAssets, setExpandedAssets] = useState<string[]>([]);

  // Mock Pendle-style data
  const pendleAssets = [
    {
      id: 'yrt-btc',
      symbol: 'yrtBTC',
      name: 'Yield BTC Token',
      logo: '/Images/Logo/cbbtc.png',
      maturity: '27 Nov 2025 (62 days)',
      totalLiquidity: 100.26,
      totalTVL: 1.68,
      volume24h: 108.44,
      underlyingAPY: 7.48,
      ytLeverage: 78,
      fixedAPY: 7.78,
      bestYTLeverage: 78,
      bestFixedAPY: 7.78,
      markets: 1,
      hasYT: true,
      hasPT: true
    },
    {
      id: 'yrt-eth',
      symbol: 'yrtETH',
      name: 'Yield Ethereum Token',
      logo: '/Images/Logo/eth-logo.svg',
      maturity: '15 Dec 2025 (84 days)',
      totalLiquidity: 245.8,
      totalTVL: 12.4,
      volume24h: 156.2,
      underlyingAPY: 5.23,
      ytLeverage: 45,
      fixedAPY: 5.12,
      bestYTLeverage: 45,
      bestFixedAPY: 5.12,
      markets: 2,
      hasYT: true,
      hasPT: true
    },
    {
      id: 'yrt-usdc',
      symbol: 'yrtUSDC',
      name: 'Yield USDC Token',
      logo: '/Images/Logo/usdc-logo.png',
      maturity: '30 Jan 2026 (127 days)',
      totalLiquidity: 89.5,
      totalTVL: 3.2,
      volume24h: 67.8,
      underlyingAPY: 4.85,
      ytLeverage: 25,
      fixedAPY: 4.92,
      bestYTLeverage: 25,
      bestFixedAPY: 4.92,
      markets: 1,
      hasYT: true,
      hasPT: true
    },
    {
      id: 'yrt-usdt',
      symbol: 'yrtUSDT',
      name: 'Yield USDT Token',
      logo: '/Images/Logo/usdt-logo.png',
      maturity: '20 Feb 2026 (147 days)',
      totalLiquidity: 156.3,
      totalTVL: 4.8,
      volume24h: 92.7,
      underlyingAPY: 6.12,
      ytLeverage: 35,
      fixedAPY: 6.45,
      bestYTLeverage: 35,
      bestFixedAPY: 6.45,
      markets: 1,
      hasYT: true,
      hasPT: true
    }
  ];

  const toggleAssetExpansion = (assetId: string) => {
    setExpandedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-6">Market</h1>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 text-center hover:border-[#3A3A3A] transition-colors">
            <div className="text-2xl font-bold text-white mb-2">$435.52M</div>
            <div className="text-sm text-gray-400">Total TVL</div>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 text-center hover:border-[#3A3A3A] transition-colors">
            <div className="text-2xl font-bold text-white mb-2">$332.46M</div>
            <div className="text-sm text-gray-400">24h Volume</div>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 text-center hover:border-[#3A3A3A] transition-colors">
            <div className="text-2xl font-bold text-white mb-2">{pendleAssets.length}</div>
            <div className="text-sm text-gray-400">Active Assets</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('assets')}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                activeTab === 'assets'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`pb-2 text-sm font-medium transition-colors relative ${
                activeTab === 'markets'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Point markets
            </button>
          </div>
        </div>

        {/* Assets List - Combined PT/YT */}
        {activeTab === 'assets' && (
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 px-4 py-4 bg-[#111111] border-b border-[#2A2A2A]">
              <div className="text-xs font-medium text-gray-400 uppercase">Market</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">
                Liquidity<br/>
                <span className="text-xs text-gray-500">Total TVL</span>
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">24h Volume</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">Underlying APY</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">YT Leverage</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">Fixed APY</div>
            </div>

            {/* Assets List */}
            <div>
              {pendleAssets.map((asset, index) => (
                <div 
                  key={asset.id} 
                  className={`p-4 hover:bg-[#111111] transition-colors ${
                    index !== pendleAssets.length - 1 ? 'border-b border-[#1A1A1A]' : ''
                  }`}
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Market Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white p-1.5 flex items-center justify-center">
                        <Image
                          src={asset.logo}
                          alt={asset.symbol}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{asset.symbol}</div>
                        <div className="text-xs text-gray-400">{asset.maturity}</div>
                      </div>
                    </div>
                    
                    {/* Liquidity/TVL */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">${asset.totalLiquidity}M</div>
                      <div className="text-xs text-gray-400">${asset.totalTVL}M</div>
                    </div>
                    
                    {/* Volume */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">${asset.volume24h}M</div>
                    </div>
                    
                    {/* Underlying APY */}
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-300">{asset.underlyingAPY}%</div>
                    </div>
                    
                    {/* YT Leverage Button */}
                    <div className="text-right">
                      <button className="bg-[#1E293B] hover:bg-[#334155] text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-[#334155]">
                        YT {asset.bestYTLeverage}x
                      </button>
                    </div>
                    
                    {/* PT Fixed APY Button */}
                    <div className="text-right">
                      <button className="bg-[#0F2A1D] hover:bg-[#1A3D2E] text-teal-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-[#1A3D2E]">
                        PT {asset.bestFixedAPY}%
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Point Markets Tab Content - Simplified */}
        {activeTab === 'markets' && (
          <div className="bg-[#0A0A0A] rounded-2xl border border-[#2A2A2A] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-4 bg-[#111111] border-b border-[#2A2A2A]">
              <div className="text-xs font-medium text-gray-400 uppercase">Token</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">Points Multiplier</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">Fixed Yield</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">LP Yield</div>
              <div className="text-xs font-medium text-gray-400 uppercase text-right">Maturity</div>
            </div>

            {/* Point Markets List */}
            <div>
              {pendleAssets.map((asset, index) => (
                <div 
                  key={asset.id} 
                  className={`p-4 hover:bg-[#111111] transition-colors ${
                    index !== pendleAssets.length - 1 ? 'border-b border-[#1A1A1A]' : ''
                  }`}
                >
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white p-1.5 flex items-center justify-center">
                        <Image
                          src={asset.logo}
                          alt={asset.symbol}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{asset.symbol}</div>
                        <div className="text-xs text-gray-400">{asset.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-400">{asset.bestYTLeverage}x</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-teal-400">{asset.bestFixedAPY}%</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">
                        {asset.symbol === 'yrtBTC' ? '17.76' : 
                         asset.symbol === 'yrtETH' ? '8.45' : 
                         asset.symbol === 'yrtUSDC' ? '6.85' : '9.25'}%
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-300">{asset.maturity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}