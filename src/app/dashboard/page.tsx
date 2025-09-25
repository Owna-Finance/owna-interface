'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw, Info, LogOut, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import Image from 'next/image';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
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

  useEffect(() => {
    if (!portfolio) {
      loadPortfolio();
    }
  }, [portfolio, loadPortfolio]);

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
              Portfolio overview
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'markets'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Available markets
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
            {/* Portfolio Summary Stats */}
            <div className="grid grid-cols-4 gap-6 mb-10">
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">$0</div>
                  <div className="text-sm text-gray-400">Total Portfolio</div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">$0</div>
                  <div className="text-sm text-gray-400">YT Positions</div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400 mb-2">$0</div>
                  <div className="text-sm text-gray-400">PT Positions</div>
                </div>
              </div>
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">$0</div>
                  <div className="text-sm text-gray-400">LP Positions</div>
                </div>
              </div>
            </div>

            {/* Portfolio Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Portfolio Distribution */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Portfolio Distribution</h3>
                  <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                </div>
                
                {/* Distribution Chart Placeholder */}
                <div className="flex items-center justify-center h-48 mb-6">
                  <div className="relative">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2A2A" strokeWidth="8"/>
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="8" 
                        strokeDasharray="0 251" strokeLinecap="round" className="transition-all duration-1000"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">0%</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-300">YT Positions</span>
                    </div>
                    <span className="text-sm font-medium text-white">0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                      <span className="text-sm text-gray-300">PT Positions</span>
                    </div>
                    <span className="text-sm font-medium text-white">0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-300">LP Positions</span>
                    </div>
                    <span className="text-sm font-medium text-white">0%</span>
                  </div>
                </div>
              </div>

              {/* Net APY & Rewards */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6 hover:border-[#3A3A3A] transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Net APY & Rewards</h3>
                  <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                </div>

                {/* Net APY Display */}
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-white mb-2">0.00%</div>
                  <div className="text-sm text-gray-400">Net APY</div>
                </div>

                {/* Rewards Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-sm text-gray-300">Owna Points</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-400">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-300">YT Rewards</span>
                    </div>
                    <span className="text-sm font-medium text-blue-400">$0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#111111] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-300">LP Fees</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">$0</span>
                  </div>
                </div>
              </div>
            </div>


            {/* PT/YT/LP Positions Tables */}
            <div className="space-y-6">
              {/* PT Positions */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-[#3A3A3A] transition-colors">
                <div className="p-6 border-b border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                      <h3 className="text-lg font-semibold text-white">PT Positions</h3>
                      <div className="px-2 py-1 bg-teal-400/10 rounded text-xs text-teal-400 font-medium">
                        Fixed Yield
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">Total Value: $0</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-5 gap-4 mb-4 text-xs font-medium text-gray-400 uppercase">
                    <div>Asset</div>
                    <div className="text-right">Balance</div>
                    <div className="text-right">Value</div>
                    <div className="text-right">Fixed APY</div>
                    <div className="text-right">Maturity</div>
                  </div>
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No PT positions found
                  </div>
                </div>
              </div>

              {/* YT Positions */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-[#3A3A3A] transition-colors">
                <div className="p-6 border-b border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <h3 className="text-lg font-semibold text-white">YT Positions</h3>
                      <div className="px-2 py-1 bg-blue-400/10 rounded text-xs text-blue-400 font-medium">
                        Variable Yield
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">Total Value: $0</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-5 gap-4 mb-4 text-xs font-medium text-gray-400 uppercase">
                    <div>Asset</div>
                    <div className="text-right">Balance</div>
                    <div className="text-right">Value</div>
                    <div className="text-right">Current APY</div>
                    <div className="text-right">Leverage</div>
                  </div>
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No YT positions found
                  </div>
                </div>
              </div>

              {/* LP Positions */}
              <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] overflow-hidden hover:border-[#3A3A3A] transition-colors">
                <div className="p-6 border-b border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <h3 className="text-lg font-semibold text-white">LP Positions</h3>
                      <div className="px-2 py-1 bg-green-400/10 rounded text-xs text-green-400 font-medium">
                        Liquidity Providing
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">Total Value: $0</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-5 gap-4 mb-4 text-xs font-medium text-gray-400 uppercase">
                    <div>Pool</div>
                    <div className="text-right">LP Balance</div>
                    <div className="text-right">Value</div>
                    <div className="text-right">APY</div>
                    <div className="text-right">Fees Earned</div>
                  </div>
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No LP positions found
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'markets' && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-semibold text-white mb-4">Available Markets</h3>
            <p className="text-gray-400">Market data will be displayed here</p>
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
            <LoadingSpinner size="lg" text="Loading portfolio..." />
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}