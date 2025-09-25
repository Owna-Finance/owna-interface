'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye, EyeOff, Star, Search, Grid3X3, List } from 'lucide-react';
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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-6">Pools</h1>
        </div>

        {/* Pool Summary Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">$1,246.8M</div>
              <div className="text-sm text-gray-400">Total Pool TVL</div>
            </div>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">$182.13M</div>
              <div className="text-sm text-gray-400">24h Pool Volume</div>
            </div>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">11.19%</div>
              <div className="text-sm text-gray-400">Highest LP APY</div>
            </div>
          </div>
          <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">{poolsData.length}</div>
              <div className="text-sm text-gray-400">Active Pools</div>
            </div>
          </div>
        </div>

        {/* Pool Categories */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Pool Categories</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111111] rounded-lg p-4 hover:bg-[#1A1A1A] transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">YT Pools</div>
                  <div className="text-xs text-gray-400">2 pools • $591.5M TVL</div>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-lg p-4 hover:bg-[#1A1A1A] transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">PT Pools</div>
                  <div className="text-xs text-gray-400">2 pools • $655.3M TVL</div>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] rounded-lg p-4 hover:bg-[#1A1A1A] transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">LP Pools</div>
                  <div className="text-xs text-gray-400">4 pools • $1,246.8M TVL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {/* Prime Badge */}
            <div className="flex items-center space-x-2 bg-[#111111] px-4 py-2 rounded-lg border border-[#2A2A2A]">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">P</span>
              </div>
              <span className="text-sm text-gray-300 font-medium">Prime</span>
            </div>

            {/* Favorites */}
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFavorites 
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                  : 'bg-[#111111] border border-[#2A2A2A] text-gray-300 hover:border-[#3A3A3A]'
              }`}
            >
              <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">Favorites</span>
            </button>

            {/* Categories Dropdown */}
            <div className="flex items-center space-x-3 text-sm bg-[#111111] px-4 py-2 rounded-lg border border-[#2A2A2A]">
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
            <div className="flex items-center space-x-1 bg-[#111111] p-1 rounded-lg border border-[#2A2A2A]">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#2A2A2A] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
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
                className="pl-10 pr-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#3A3A3A] transition-colors w-80"
              />
            </div>
          </div>
        </div>

        {/* Pools Table */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden">
          {/* List View */}
          {viewMode === 'list' && (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 p-4 bg-[#111111] border-b border-[#2A2A2A]">
                <div className="text-xs font-medium text-gray-400 uppercase">
                  <div className="flex items-center space-x-2">
                    <span>Asset</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-400 uppercase text-center">
                  24h Volume
                </div>
                <div className="text-xs font-medium text-gray-400 uppercase text-center">
                  Total Liquidity<br />
                  <span className="text-xs text-gray-500">Total TVL</span>
                </div>
                <div className="text-xs font-medium text-gray-400 uppercase text-center">
                  Best LP APY
                </div>
                <div className="text-xs font-medium text-gray-400 uppercase text-center">
                  Actions
                </div>
              </div>

              {/* Pools List */}
          <div>
            {filteredPools.map((pool, index) => (
              <div key={pool.id}>
                {/* Pool Row */}
                <div 
                  className={`grid grid-cols-5 gap-4 p-4 hover:bg-[#111111] transition-colors cursor-pointer ${
                    index !== filteredPools.length - 1 ? 'border-b border-[#1A1A1A]' : ''
                  }`}
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
                  <div className="bg-[#111111] border-t border-[#2A2A2A]">
                    {/* Pool Table Header */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-[#0A0A0A] border-b border-[#2A2A2A]">
                      <div className="text-xs font-medium text-gray-400 uppercase">
                        Pool
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase text-center">
                        24h Volume
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase text-center">
                        Liquidity<br />
                        <span className="text-xs text-gray-500">Total TVL</span>
                      </div>
                      <div className="text-xs font-medium text-gray-400 uppercase text-center">
                        LP APY
                      </div>
                    </div>

                    {/* Individual Pool Rows */}
                    {pool.pools.map((individualPool, poolIndex) => (
                      <div 
                        key={individualPool.id}
                        className={`grid grid-cols-4 gap-4 p-4 hover:bg-[#1A1A1A] transition-colors ${
                          poolIndex !== pool.pools.length - 1 ? 'border-b border-[#2A2A2A]' : ''
                        }`}
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
            </>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPools.map((pool) => (
                  <div key={pool.id} className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center">
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
                          <h3 className="text-lg font-semibold text-white">{pool.symbol}</h3>
                          <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                            {pool.markets} Markets
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{pool.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">24h Volume</span>
                        <span className="text-sm font-medium text-white">${pool.volume24h}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Liquidity</span>
                        <span className="text-sm font-medium text-white">${pool.totalLiquidity}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total TVL</span>
                        <span className="text-sm font-medium text-gray-300">${pool.totalTVL}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Best LP APY</span>
                        <span className="text-sm font-medium text-green-400">{pool.bestLPAPY}%</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#2A2A2A]">
                      <button 
                        onClick={() => togglePoolExpansion(pool.id)}
                        className="w-full bg-[#1E293B] hover:bg-[#334155] text-blue-400 py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-[#334155] flex items-center justify-center space-x-2"
                      >
                        <span>View Details</span>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedPools.includes(pool.id) ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {/* Expanded Pool Details in Grid */}
                      {expandedPools.includes(pool.id) && (
                        <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                          <h4 className="text-sm font-medium text-white mb-3">Pool Details</h4>
                          <div className="space-y-2">
                            {pool.pools.map((individualPool) => (
                              <div key={individualPool.id} className="bg-[#0A0A0A] rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 rounded-full bg-white p-0.5 flex items-center justify-center">
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
                                  <span className="text-xs text-green-400 font-medium">{individualPool.lpApy}%</span>
                                </div>
                                <div className="text-xs text-gray-400">{individualPool.maturity}</div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-gray-500">Volume: ${individualPool.volume24h}M</span>
                                  <span className="text-xs text-gray-500">TVL: ${individualPool.totalTVL}M</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}