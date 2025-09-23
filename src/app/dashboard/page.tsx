'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw, Info, ChevronDown, Eye, EyeOff, LogOut, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import Image from 'next/image';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [showDeposits, setShowDeposits] = useState(true);
  const [showBorrows, setShowBorrows] = useState(true);
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
    refreshPortfolio,
    getPortfolioSummary,
    clearError
  } = usePortfolioStore();

  useEffect(() => {
    if (!portfolio) {
      loadPortfolio();
    }
  }, [portfolio, loadPortfolio]);

  const summary = getPortfolioSummary();
  const healthFactor = 2.5; // Mock health factor
  const netAPY = 0.00; // Mock net APY

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
                                window.open(`https://basescan.org/address/${address}`, '_blank');
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
                  ? 'bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-gray-200'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Portfolio overview
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'markets'
                  ? 'bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-gray-200'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Available markets
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'activity'
                  ? 'bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-gray-200'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Activity History
            </button>
          </div>
        </div>

        {activeTab === 'portfolio' && (
          <>
            {/* Total Portfolio Value */}
            <div className="mb-10">
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-xl font-semibold text-white">Total Spot Value</h2>
                  <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors cursor-help" />
                </div>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-white mb-2">
                    $0
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-sm font-medium">+$0</span>
                    <span className="text-green-400 text-sm">(+0.00%)</span>
                    <span className="text-gray-400 text-sm">Today</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-[#2A2A2A]">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Available Balance</div>
                    <div className="text-lg font-semibold text-white">$0</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Staked Assets</div>
                    <div className="text-lg font-semibold text-white">$0</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">DeFi Positions</div>
                    <div className="text-lg font-semibold text-white">$0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Health Factor */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">Health Factor</h3>
                    <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  </div>
                  <div className="bg-[#2A2A2A]/50 px-4 py-2 rounded-xl border border-[#3A3A3A]">
                    <span className="text-sm font-medium text-white">{healthFactor}</span>
                  </div>
                </div>
                
                {/* Circular Health Factor Gauge */}
                <div className="flex items-center justify-center relative">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="#2A2A2A"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="url(#healthGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(healthFactor / 5) * 502} 502`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    />
                    {/* Scale markers */}
                    <g className="transform rotate-90" style={{ transformOrigin: '100px 100px' }}>
                      <text x="100" y="50" textAnchor="middle" className="text-xs fill-gray-400">4</text>
                      <text x="150" y="75" textAnchor="middle" className="text-xs fill-gray-400">3.5</text>
                      <text x="175" y="105" textAnchor="middle" className="text-xs fill-gray-400">3</text>
                      <text x="150" y="135" textAnchor="middle" className="text-xs fill-gray-400">2.5</text>
                      <text x="100" y="160" textAnchor="middle" className="text-xs fill-gray-400">2</text>
                      <text x="50" y="135" textAnchor="middle" className="text-xs fill-gray-400">1.5</text>
                      <text x="25" y="105" textAnchor="middle" className="text-xs fill-gray-400">1</text>
                    </g>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{healthFactor}</span>
                  </div>
                </div>
              </div>

              {/* Your Position */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">Your position</h3>
                    <Info className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Net APY</div>
                    <div className="text-sm font-medium text-white">{netAPY}%</div>
                  </div>
                </div>

                {/* Collateral deposited */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Collateral deposited</span>
                    <span className="text-sm font-medium text-white">
                      {formatCurrency(summary.totalValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>0</span>
                    <span>22.5K</span>
                    <span>45K</span>
                    <span>67.5K</span>
                    <span>90K</span>
                  </div>
                  <div className="w-full bg-[#2A2A2A] rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-500" 
                      style={{ width: `${Math.min((summary.totalValue / 90000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Borrow */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Borrow</span>
                    <span className="text-sm font-medium text-white">-</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>0</span>
                    <span>22.5K</span>
                    <span>45K</span>
                    <span>67.5K</span>
                    <span>90K</span>
                  </div>
                  <div className="w-full bg-[#2A2A2A] rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-500 to-orange-400 h-3 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>


            {/* My deposits and My borrows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My deposits */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="p-8 border-b border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">My deposits</h3>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setShowDeposits(!showDeposits)}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      >
                        {showDeposits ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <span className="text-sm text-gray-400">Hide</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-[#2A2A2A]">
                        <th className="pb-4 text-sm font-medium text-gray-400">Assets</th>
                        <th className="pb-4 text-sm font-medium text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span>Balance</span>
                            <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                          </div>
                        </th>
                        <th className="pb-4 text-sm font-medium text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span>APY</span>
                            <Info className="w-3 h-3 hover:text-gray-200 transition-colors" />
                            <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                          </div>
                        </th>
                        <th className="pb-4 text-sm font-medium text-gray-400">Collateral</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="pt-12 text-center">
                          <div className="text-gray-500 text-sm">No data to display</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* My borrows */}
              <div className="bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
                <div className="p-8 border-b border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">My borrows</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">E-Mode</span>
                      <div className="w-10 h-5 bg-[#2A2A2A] rounded-full relative border border-[#3A3A3A]">
                        <div className="w-4 h-4 bg-gray-300 rounded-full absolute top-0.5 left-0.5 shadow-sm transition-all duration-200"></div>
                      </div>
                      <button 
                        onClick={() => setShowBorrows(!showBorrows)}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      >
                        {showBorrows ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                      <span className="text-sm text-gray-400">Hide</span>
                      <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-[#2A2A2A]">
                        <th className="pb-4 text-sm font-medium text-gray-400">Assets</th>
                        <th className="pb-4 text-sm font-medium text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span>Debt</span>
                            <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                          </div>
                        </th>
                        <th className="pb-4 text-sm font-medium text-gray-400">
                          <div className="flex items-center space-x-1">
                            <span>APY</span>
                            <Info className="w-3 h-3 hover:text-gray-200 transition-colors" />
                            <ChevronDown className="w-3 h-3 hover:text-gray-200 transition-colors" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="pt-12 text-center">
                          <div className="text-gray-500 text-sm">No data to display</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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