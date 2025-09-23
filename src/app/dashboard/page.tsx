'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatCurrency, formatPercentage, getTokenById } from '@/lib/utils';
import { RefreshCw, Info, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [hideZeroBalances, setHideZeroBalances] = useState(false);
  const [showDeposits, setShowDeposits] = useState(true);
  const [showBorrows, setShowBorrows] = useState(true);

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
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-[#1A1A1A]/70 border border-[#2A2A2A] rounded-xl p-1 backdrop-blur-sm">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="bg-[#1A1A1A]/40 backdrop-blur-sm rounded-2xl p-2 border border-[#2A2A2A]/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] inline-flex">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'portfolio'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Portfolio overview
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'markets'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Available markets
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 relative ${
                activeTab === 'activity'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-400/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
              }`}
            >
              Activity History
            </button>
          </div>
        </div>

        {activeTab === 'portfolio' && (
          <>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Health Factor */}
              <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
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
              <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] p-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
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
              <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
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
              <div className="bg-[#1A1A1A]/70 backdrop-blur-sm rounded-2xl border border-[#2A2A2A] shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-[#3A3A3A]">
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