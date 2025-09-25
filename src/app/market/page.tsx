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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Total TVL</h3>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">$435.52M</div>
              <div className="text-sm text-green-400">+12.3%</div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">24h Volume</h3>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">$332.46M</div>
              <div className="text-sm text-green-400">+8.7%</div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Active Assets</h3>
            </div>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-white">{pendleAssets.length}</div>
              <div className="text-sm text-blue-400">PT & YT Markets</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="bg-[#1A1A1A]/40 backdrop-blur-sm rounded-2xl p-2 border border-[#2A2A2A]/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] inline-flex">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'assets'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'markets'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Point markets
            </button>
          </div>
        </div>

        {/* Assets List - Pendle Style with Dropdown */}
        {activeTab === 'assets' && (
          <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-[#0F0F0F]/50 border-b border-[#2A2A2A]/50">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>Asset</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Total Liquidity<br />
                <span className="text-xs text-gray-500">Total TVL</span>
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Total 24h Vol
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Best YT Leverage
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Best Fixed APY
              </div>
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center">
                Actions
              </div>
            </div>

            {/* Assets List */}
            <div className="divide-y divide-[#2A2A2A]/30">
              {pendleAssets.map((asset) => (
                <div key={asset.id}>
                  {/* Asset Row */}
                  <div 
                    className="grid grid-cols-6 gap-4 p-4 hover:bg-[#2A2A2A]/20 transition-all duration-200 cursor-pointer"
                    onClick={() => toggleAssetExpansion(asset.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center shadow-[0_0_8px_rgba(0,0,0,0.1)]">
                        <Image
                          src={asset.logo}
                          alt={asset.symbol}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-white">{asset.symbol}</h3>
                          <div className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center">
                            <Info className="w-1.5 h-1.5 text-gray-300" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{asset.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">${asset.totalLiquidity}M</div>
                      <div className="text-xs text-gray-400">${asset.totalTVL}B</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">${asset.volume24h}M</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-400">{asset.bestYTLeverage}x</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-400">{asset.bestFixedAPY}%</div>
                    </div>
                    
                    <div className="flex justify-center">
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          expandedAssets.includes(asset.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Expanded Markets Table */}
                  {expandedAssets.includes(asset.id) && (
                    <div className="bg-[#0A0A0A]/30 border-t border-[#2A2A2A]/30">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#2A2A2A]/30 bg-[#0A0A0A]/50">
                              <th className="text-left p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Market
                              </th>
                              <th className="text-center p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Liquidity<br />
                                <span className="text-xs text-gray-500">Total TVL</span>
                              </th>
                              <th className="text-center p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                24h Volume
                              </th>
                              <th className="text-center p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Underlying APY
                              </th>
                              <th className="text-center p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                YT Leverage
                              </th>
                              <th className="text-center p-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Fixed APY
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#2A2A2A]/20 hover:bg-[#2A2A2A]/10 transition-all duration-200">
                              <td className="p-3">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-white p-1 flex items-center justify-center">
                                      <Image
                                        src={asset.logo}
                                        alt={asset.symbol}
                                        width={12}
                                        height={12}
                                        className="rounded-full"
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-white">{asset.symbol}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">{asset.maturity}</div>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="text-xs font-medium text-white">${asset.totalLiquidity}M</div>
                                <div className="text-xs text-gray-400">${asset.totalTVL}B</div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="text-xs font-medium text-white">${asset.volume24h}M</div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="text-xs font-medium text-white">{asset.underlyingAPY}%</div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-xs font-medium">
                                    YT
                                  </div>
                                  <span className="text-xs font-medium text-white">{asset.ytLeverage}x</span>
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded text-xs font-medium">
                                    PT
                                  </div>
                                  <span className="text-xs font-medium text-white">{asset.fixedAPY}%</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Point Markets Tab Content */}
        {activeTab === 'markets' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* yrtBTC Point Market */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center">
                      <Image
                        src="/Images/Logo/cbbtc.png"
                        alt="yrtBTC"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">yrtBTC</h3>
                      <p className="text-xs text-gray-400">27 Nov 2025 (62 days)</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-300">⚡</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Owna Points</div>
                    <div className="text-2xl font-bold text-white">78x</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Fixed Yield</span>
                    <span className="text-sm font-medium text-teal-400">7.78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">LP Yield</span>
                    <span className="text-sm font-medium text-green-400">17.76%</span>
                  </div>
                </div>
              </div>

              {/* yrtETH Point Market */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center">
                      <Image
                        src="/Images/Logo/eth-logo.svg"
                        alt="yrtETH"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">yrtETH</h3>
                      <p className="text-xs text-gray-400">15 Dec 2025 (84 days)</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-300">⚡</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Owna Points</div>
                    <div className="text-2xl font-bold text-white">45x</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Fixed Yield</span>
                    <span className="text-sm font-medium text-teal-400">5.12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">LP Yield</span>
                    <span className="text-sm font-medium text-green-400">8.45%</span>
                  </div>
                </div>
              </div>

              {/* yrtUSDC Point Market */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center">
                      <Image
                        src="/Images/Logo/usdc-logo.png"
                        alt="yrtUSDC"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">yrtUSDC</h3>
                      <p className="text-xs text-gray-400">30 Jan 2026 (127 days)</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-300">⚡</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Owna Points</div>
                    <div className="text-2xl font-bold text-white">25x</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Fixed Yield</span>
                    <span className="text-sm font-medium text-teal-400">4.92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">LP Yield</span>
                    <span className="text-sm font-medium text-green-400">6.85%</span>
                  </div>
                </div>
              </div>

              {/* yrtUSDT Point Market */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-white p-2 flex items-center justify-center">
                      <Image
                        src="/Images/Logo/usdt-logo.png"
                        alt="yrtUSDT"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">yrtUSDT</h3>
                      <p className="text-xs text-gray-400">20 Feb 2026 (147 days)</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-300">⚡</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Owna Points</div>
                    <div className="text-2xl font-bold text-white">35x</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Fixed Yield</span>
                    <span className="text-sm font-medium text-teal-400">6.45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">LP Yield</span>
                    <span className="text-sm font-medium text-green-400">9.25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}