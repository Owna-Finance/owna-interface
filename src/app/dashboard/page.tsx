'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw, Info, LogOut, Copy, ExternalLink, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useDistributeToAllHolders } from '@/hooks';
import Image from 'next/image';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [distributeFormData, setDistributeFormData] = useState({
    seriesId: '',
    periodId: ''
  });
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { distributeToAllHolders, hash: distributeHash, isLoading: isDistributeLoading, isSuccess: isDistributeSuccess, error: distributeError } = useDistributeToAllHolders();
  
  // Get ETH balance on Base Sepolia
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    chainId: 84532, // Base Sepolia testnet
  });

  const {
    portfolio,
    isLoading,
    error,
    loadPortfolio,
    clearError
  } = usePortfolioStore();

  // Mock YRT holdings data
  const yrtHoldings = [
    {
      propertyName: 'YRT-HRA',
      balance: '125.50',
      value: '$15,687.50',
      apy: '8.2%',
      location: 'Yogyakarta',
      type: 'Hotel',
      performance: '+12.5%'
    },
    {
      propertyName: 'YRT-UKDW',
      balance: '89.25',
      value: '$11,156.25',
      apy: '6.8%',
      location: 'Yogyakarta',
      type: 'University',
      performance: '+8.7%'
    },
    {
      propertyName: 'YRT-HF',
      balance: '67.80',
      value: '$8,475.00',
      apy: '7.5%',
      location: 'Yogyakarta',
      type: 'Hotel',
      performance: '+15.2%'
    },
    {
      propertyName: 'YRT-HMM',
      balance: '45.30',
      value: '$5,662.50',
      apy: '9.1%',
      location: 'Yogyakarta',
      type: 'Hotel',
      performance: '+18.9%'
    }
  ];

  const totalYRTValue = yrtHoldings.reduce((sum, holding) => 
    sum + parseFloat(holding.value.replace('$', '').replace(',', '')), 0
  );

  useEffect(() => {
    if (!portfolio) {
      loadPortfolio();
    }
  }, [portfolio, loadPortfolio]);

  const handleDistributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet');
      return;
    }

    if (!distributeFormData.seriesId || !distributeFormData.periodId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await distributeToAllHolders(distributeFormData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to distribute to all holders');
    }
  };

  const handleDistributeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDistributeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => { clearError(); loadPortfolio(); }}>
              Try Again
            </Button>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-6">
            {isConnected ? (
              <>
                {/* Balance Display */}
                <div className="flex items-center space-x-3">
                  <Image
                    src="/Images/Logo/eth-logo.svg"
                    alt="ETH"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="text-white font-medium text-lg">
                    {balanceLoading ? '...' : balance ? (parseFloat(balance.value.toString()) / Math.pow(10, balance.decimals)).toFixed(4) : '0.0000'}
                  </span>
                </div>
                
                {/* Wallet Address - Clickable */}
                <div className="relative">
                  <button
                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                    className="bg-[#1A1A1A]/70 border border-[#2A2A2A] rounded-2xl px-4 py-2 backdrop-blur-sm flex items-center space-x-3 hover:bg-[#2A2A2A]/50 hover:border-[#3A3A3A] transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-gray-300 font-mono text-sm">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0xebFA...4179'}
                    </span>
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {/* Wallet Dropdown */}
                  {showWalletDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm z-50">
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">Connected Wallet</div>
                            <div className="text-gray-400 text-xs font-mono">
                              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '0xebFA...4179'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              if (address) {
                                navigator.clipboard.writeText(address);
                              }
                              setShowWalletDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A]/50 rounded-xl transition-all duration-200"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copy Address</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (address) {
                                window.open(`https://sepolia.basescan.org/address/${address}`, '_blank');
                              }
                              setShowWalletDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2A2A2A]/50 rounded-xl transition-all duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm">View on Explorer</span>
                          </button>
                          
                          <div className="border-t border-[#2A2A2A] my-2"></div>
                          
                          <button
                            onClick={() => {
                              disconnect();
                              setShowWalletDropdown(false);
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Disconnect</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    /* Override RainbowKit Connect Button Styles */
                    [data-rk] button[data-testid="rk-connect-button"] {
                      background: linear-gradient(135deg, #1A1A1A, #2A2A2A) !important;
                      border: 1px solid #3A3A3A !important;
                      color: #ffffff !important;
                      border-radius: 16px !important;
                      padding: 12px 24px !important;
                      font-weight: 500 !important;
                      font-size: 14px !important;
                      box-shadow: 0 0 20px rgba(255,255,255,0.05) !important;
                      transition: all 0.3s ease !important;
                      backdrop-filter: blur(10px) !important;
                    }
                    [data-rk] button[data-testid="rk-connect-button"]:hover {
                      background: linear-gradient(135deg, #2A2A2A, #3A3A3A) !important;
                      border: 1px solid #4A4A4A !important;
                      box-shadow: 0 0 30px rgba(255,255,255,0.1) !important;
                      transform: translateY(-1px) !important;
                    }
                    /* Override any nested button styles */
                    [data-rk] div[role="button"] {
                      background: linear-gradient(135deg, #1A1A1A, #2A2A2A) !important;
                      border: 1px solid #3A3A3A !important;
                      color: #ffffff !important;
                      border-radius: 16px !important;
                      padding: 12px 24px !important;
                      font-weight: 500 !important;
                      box-shadow: 0 0 20px rgba(255,255,255,0.05) !important;
                      transition: all 0.3s ease !important;
                    }
                    [data-rk] div[role="button"]:hover {
                      background: linear-gradient(135deg, #2A2A2A, #3A3A3A) !important;
                      border: 1px solid #4A4A4A !important;
                      box-shadow: 0 0 30px rgba(255,255,255,0.1) !important;
                    }
                  `
                }} />
                <ConnectButton />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5">
          <div className="bg-[#1A1A1A]/40 backdrop-blur-sm rounded-2xl p-2 border border-[#2A2A2A]/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] inline-flex">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'portfolio'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              YRT Portfolio
            </button>
            <button
              onClick={() => setActiveTab('distribute')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'distribute'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Distribute Yield
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'activity'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Activity History
            </button>
          </div>
        </div>


        {activeTab === 'portfolio' && (
          <>
            {/* YRT Portfolio Summary Stats */}
            <div className="grid grid-cols-4 gap-6 mb-10">
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">${totalYRTValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total YRT Value</div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">{yrtHoldings.length}</div>
                  <div className="text-sm text-gray-400">Properties Owned</div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">+13.8%</div>
                  <div className="text-sm text-gray-400">Portfolio Growth</div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">$2,847</div>
                  <div className="text-sm text-gray-400">Monthly Yield</div>
                </div>
              </div>
            </div>

            {/* Portfolio Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Property Type Distribution */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Property Distribution</h3>
                  <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                </div>
                
                {/* Distribution Chart */}
                <div className="flex items-center justify-center h-48 mb-6">
                  <div className="relative">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2A2A" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="8" 
                        strokeDasharray="188 251" strokeLinecap="round" className="transition-all duration-1000"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="8" 
                        strokeDasharray="63 251" strokeDashoffset="-188" strokeLinecap="round" className="transition-all duration-1000"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">100%</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-300">Hotels</span>
                    </div>
                    <span className="text-sm font-medium text-white">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-300">Educational</span>
                    </div>
                    <span className="text-sm font-medium text-white">25%</span>
                  </div>
                </div>
              </div>

              {/* Yield & Performance */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Yield & Performance</h3>
                  <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                </div>

                {/* Average APY Display */}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-white mb-2">7.9%</div>
                  <div className="text-sm text-gray-400">Average APY</div>
                </div>

                {/* Performance Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-300">Total Gains</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">+$5,624</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-sm text-gray-300">Monthly Yield</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-400">$2,847</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-sm text-gray-300">Property Appreciation</span>
                    </div>
                    <span className="text-sm font-medium text-purple-400">+8.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* YRT Holdings Table */}
            <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden">
              <div className="p-6 border-b border-[#2A2A2A]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">YRT Holdings</h3>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300 font-medium">
                      Real Estate Tokens
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">Total Value: ${totalYRTValue.toLocaleString()}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4 mb-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <div>Property</div>
                  <div className="text-right">Balance</div>
                  <div className="text-right">Value</div>
                  <div className="text-right">APY</div>
                  <div className="text-right">Type</div>
                  <div className="text-right">Location</div>
                  <div className="text-right">Performance</div>
                </div>
                <div className="space-y-1">
                  {yrtHoldings.map((holding, index) => (
                    <div key={index} className="grid grid-cols-7 gap-4 p-4 hover:bg-[#111111]/50 transition-colors rounded-lg border-b border-white/5 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                          <Image
                            src="/Images/Logo/logo_YRT.jpg"
                            alt="YRT Logo"
                            width={24}
                            height={24}
                            className="object-contain w-full h-full rounded-full"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{holding.propertyName}</div>
                          <div className="text-xs text-gray-500">Yogyakarta Real Estate</div>
                        </div>
                      </div>
                      <div className="text-right text-white font-medium">{holding.balance}</div>
                      <div className="text-right text-white font-medium">{holding.value}</div>
                      <div className="text-right text-green-400 font-medium">{holding.apy}</div>
                      <div className="text-right text-gray-400">{holding.type}</div>
                      <div className="text-right text-gray-400">{holding.location}</div>
                      <div className="text-right text-green-400 font-medium">{holding.performance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'distribute' && (
          <div className="space-y-6">
            {/* Distribute to All Holders Section */}
            <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
              <div className="flex items-center space-x-2 mb-6">
                <Send className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Distribute to All Holders</h3>
              </div>
              
              <form onSubmit={handleDistributeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Series ID
                    </label>
                    <input
                      type="text"
                      name="seriesId"
                      value={distributeFormData.seriesId}
                      onChange={handleDistributeInputChange}
                      placeholder="e.g., 1"
                      className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">YRT series ID to distribute for</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Period ID
                    </label>
                    <input
                      type="text"
                      name="periodId"
                      value={distributeFormData.periodId}
                      onChange={handleDistributeInputChange}
                      placeholder="e.g., 1"
                      className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Period ID to distribute yield for</p>
                  </div>
                </div>

                {/* Distribution Transaction Status */}
                {(distributeHash || distributeError) && (
                  <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-lg">
                    {distributeHash && (
                      <>
                        <p className="text-sm text-gray-400 mb-2">Distribution Transaction Hash:</p>
                        <p className="text-xs font-mono text-purple-400 break-all">{distributeHash}</p>
                      </>
                    )}
                    {isDistributeLoading && (
                      <p className="text-sm text-yellow-400 mt-2">⏳ Distributing to all holders...</p>
                    )}
                    {isDistributeSuccess && (
                      <p className="text-sm text-green-400 mt-2">✅ Distribution completed successfully!</p>
                    )}
                    {distributeError && (
                      <p className="text-sm text-red-400 mt-2">❌ Error: {distributeError.message}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isDistributeLoading || !address}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDistributeLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                        <span>Distributing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Distribute to All Holders</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Future Distribution Functions */}
            <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Distribution Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
                  <h4 className="text-white font-medium mb-2">Distribute to Specific Holders</h4>
                  <p className="text-gray-400 text-sm">Coming soon - distribute yield to selected token holders</p>
                </div>
                <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
                  <h4 className="text-white font-medium mb-2">Batch Distribution</h4>
                  <p className="text-gray-400 text-sm">Coming soon - process distributions in batches</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-semibold text-white mb-4">Activity History</h3>
            <p className="text-gray-400">Transaction history will be displayed here</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !portfolio && (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Loading YRT portfolio..." />
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}