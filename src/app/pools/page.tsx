'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye, EyeOff, Star, Search, Grid3X3, List, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function PoolsPage() {
  const [hideZeroBalance, setHideZeroBalance] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [expandedPools, setExpandedPools] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Pools data similar to Pendle
  const poolsData = [
    {
      id: 'yrt-btc',
      symbol: 'yrtBTC',
      name: 'Yield BTC Token',
      logo: '/Images/Logo/cbbtc.png',
      markets: 2,
      volume24h: 30.76,
      totalLiquidity: 205.08,
      totalTVL: 978.66,
      bestLPAPY: 11.19,
      pools: [
        {
          id: 'yrtbtc-pool-1',
          symbol: 'yrtBTC',
          maturity: '13 Nov 2025 (48 days)',
          volume24h: 24.92,
          liquidity: 128.04,
          totalTVL: 751.73,
          lpApy: 6.99
        },
        {
          id: 'yrtbtc-pool-2', 
          symbol: 'yrtBTC',
          maturity: '27 Dec 2025 (62 days)',
          volume24h: 5.84,
          liquidity: 77.03,
          totalTVL: 226.93,
          lpApy: 11.19
        }
      ]
    },
    {
      id: 'yrt-eth',
      symbol: 'yrtETH',
      name: 'Yield Ethereum Token',
      logo: '/Images/Logo/eth-logo.svg',
      markets: 1,
      volume24h: 108.44,
      totalLiquidity: 100.26,
      totalTVL: 1.68,
      bestLPAPY: 17.76,
      pools: [
        {
          id: 'yrteth-pool-1',
          symbol: 'yrtETH',
          maturity: '15 Dec 2025 (84 days)',
          volume24h: 108.44,
          liquidity: 100.26,
          totalTVL: 1.68,
          lpApy: 17.76
        }
      ]
    },
    {
      id: 'yrt-usdc',
      symbol: 'yrtUSDC',
      name: 'Yield USDC Token',
      logo: '/Images/Logo/usdc-logo.png',
      markets: 1,
      volume24h: 16.02,
      totalLiquidity: 28.66,
      totalTVL: 649.42,
      bestLPAPY: 9.14,
      pools: [
        {
          id: 'yrtusdc-pool-1',
          symbol: 'yrtUSDC',
          maturity: '30 Jan 2026 (127 days)',
          volume24h: 16.02,
          liquidity: 28.66,
          totalTVL: 649.42,
          lpApy: 9.14
        }
      ]
    },
    {
      id: 'yrt-usdt',
      symbol: 'yrtUSDT',
      name: 'Yield USDT Token',
      logo: '/Images/Logo/usdt-logo.png',
      markets: 1,
      volume24h: 27.03,
      totalLiquidity: 85.81,
      totalTVL: 273.34,
      bestLPAPY: 11.31,
      pools: [
        {
          id: 'yrtusdt-pool-1',
          symbol: 'yrtUSDT',
          maturity: '20 Feb 2026 (147 days)',
          volume24h: 27.03,
          liquidity: 85.81,
          totalTVL: 273.34,
          lpApy: 11.31
        }
      ]
    }
  ];

  const togglePoolExpansion = (poolId: string) => {
    setExpandedPools(prev => 
      prev.includes(poolId) 
        ? prev.filter(id => id !== poolId)
        : [...prev, poolId]
    );
  };

  const filteredPools = poolsData.filter(pool => 
    pool.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">Pools</h1>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {/* Prime Badge */}
            <div className="flex items-center space-x-2 bg-[#1A1A1A]/40 px-4 py-2 rounded-xl border border-[#2A2A2A]/50">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">P</span>
              </div>
              <span className="text-sm text-gray-300 font-medium">Prime</span>
            </div>

            {/* Favorites */}
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                showFavorites 
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                  : 'bg-[#1A1A1A]/40 border border-[#2A2A2A]/50 text-gray-300 hover:bg-[#2A2A2A]/50'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">Favorites</span>
            </button>

            {/* Categories Dropdown */}
            <div className="flex items-center space-x-3 text-sm bg-[#1A1A1A]/40 px-4 py-2 rounded-xl border border-[#2A2A2A]/50">
              <span className="text-gray-300 font-medium">{selectedCategory}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Collapse All */}
            <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
              <span>Collapse All</span>
            </button>

            {/* View Mode Toggles */}
            <div className="flex items-center space-x-1 bg-[#1A1A1A]/40 p-1 rounded-lg border border-[#2A2A2A]/50">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or paste address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#1A1A1A]/40 border border-[#2A2A2A]/50 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#3A3A3A] transition-colors w-80"
              />
            </div>
          </div>
        </div>

        {/* Pools Table */}
        <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-[#0F0F0F]/50 border-b border-[#2A2A2A]/50">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span>Asset</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
              24h Volume
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
              Total Liquidity<br />
              <span className="text-xs text-gray-500">Total TVL</span>
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
              Best LP APY <span className="text-xs">(up to)</span>
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
              Actions
            </div>
          </div>

          {/* Pools List */}
          <div className="divide-y divide-[#2A2A2A]/30">
            {filteredPools.map((pool) => (
              <div key={pool.id}>
                {/* Pool Row */}
                <div 
                  className="grid grid-cols-5 gap-4 p-4 hover:bg-[#2A2A2A]/20 transition-all duration-200 cursor-pointer"
                  onClick={() => togglePoolExpansion(pool.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center shadow-[0_0_8px_rgba(0,0,0,0.1)]">
                      <Image
                        src={pool.logo}
                        alt={pool.symbol}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-semibold text-white">{pool.symbol}</h3>
                      </div>
                      <p className="text-xs text-gray-400">{pool.name}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                        {pool.markets} Markets
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">${pool.volume24h}M</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">${pool.totalLiquidity}M</div>
                    <div className="text-xs text-gray-400">${pool.totalTVL}M</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-400">{pool.bestLPAPY}%</div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedPools.includes(pool.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </div>

                {/* Expanded Pools Table */}
                {expandedPools.includes(pool.id) && (
                  <div className="bg-[#0A0A0A]/30 border-t border-[#2A2A2A]/30">
                    {/* Pool Table Header */}
                    <div className="grid grid-cols-4 gap-4 p-3 bg-[#0A0A0A]/50 border-b border-[#2A2A2A]/30">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Pool
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                        24h Volume
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                        Liquidity<br />
                        <span className="text-xs text-gray-500">Total TVL</span>
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                        LP APY
                      </div>
                    </div>

                    {/* Individual Pool Rows */}
                    {pool.pools.map((individualPool) => (
                      <div 
                        key={individualPool.id}
                        className="grid grid-cols-4 gap-4 p-3 hover:bg-[#2A2A2A]/10 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-white p-1 flex items-center justify-center">
                              <Image
                                src={pool.logo}
                                alt={individualPool.symbol}
                                width={12}
                                height={12}
                                className="rounded-full"
                              />
                            </div>
                            <span className="text-xs font-medium text-white">{individualPool.symbol}</span>
                          </div>
                          <div className="text-xs text-gray-400">{individualPool.maturity}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs font-medium text-white">${individualPool.volume24h}M</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xs font-medium text-white">${individualPool.liquidity}M</div>
                          <div className="text-xs text-gray-400">${individualPool.totalTVL}M</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <div className="text-xs font-medium text-green-400">{individualPool.lpApy}%</div>
                            <div className="text-xs text-green-400">↗</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}