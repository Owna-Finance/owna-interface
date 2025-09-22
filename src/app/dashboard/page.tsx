'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatCurrency, formatPercentage, getTokenById } from '@/lib/utils';
import { RefreshCw, Info, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>0xe...179</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'portfolio'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Portfolio overview
          </button>
          <button
            onClick={() => setActiveTab('markets')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'markets'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Available markets
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 font-medium text-sm ${
              activeTab === 'activity'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Activity History
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <>
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Health Factor */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Health Factor</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{healthFactor}</span>
                  </div>
                </div>
                
                {/* Circular Health Factor Gauge */}
                <div className="flex items-center justify-center relative">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="rgb(243 244 246)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="rgb(0 0 0)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(healthFactor / 5) * 502} 502`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-in-out"
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
                    <span className="text-3xl font-bold text-gray-900">{healthFactor}</span>
                  </div>
                </div>
              </div>

              {/* Your Position */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900">Your position</h3>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Net APY</div>
                    <div className="text-sm font-medium text-gray-900">{netAPY}%</div>
                  </div>
                </div>

                {/* Collateral deposited */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Collateral deposited</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(summary.totalValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>0</span>
                    <span>22.5K</span>
                    <span>45K</span>
                    <span>67.5K</span>
                    <span>90K</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((summary.totalValue / 90000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Borrow */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Borrow</span>
                    <span className="text-sm font-medium text-gray-900">-</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>0</span>
                    <span>22.5K</span>
                    <span>45K</span>
                    <span>67.5K</span>
                    <span>90K</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Token Icons */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full"></div>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Deposit your assets and borrow with our Easy Borrow Flow
              </h2>
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2">
                Create position
              </Button>
            </div>

            {/* My deposits and My borrows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My deposits */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">My deposits</h3>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setShowDeposits(!showDeposits)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showDeposits ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <span className="text-sm text-gray-500">Hide</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="pb-3 text-sm font-medium text-gray-600">Assets</th>
                        <th className="pb-3 text-sm font-medium text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>Balance</span>
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="pb-3 text-sm font-medium text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>APY</span>
                            <Info className="w-3 h-3" />
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="pb-3 text-sm font-medium text-gray-600">Collateral</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="pt-8 text-center">
                          <div className="text-gray-400 text-sm">No data to display</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* My borrows */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">My borrows</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">E-Mode</span>
                      <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                        <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div>
                      </div>
                      <button 
                        onClick={() => setShowBorrows(!showBorrows)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showBorrows ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <span className="text-sm text-gray-500">Hide</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="pb-3 text-sm font-medium text-gray-600">Assets</th>
                        <th className="pb-3 text-sm font-medium text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>Debt</span>
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </th>
                        <th className="pb-3 text-sm font-medium text-gray-600">
                          <div className="flex items-center space-x-1">
                            <span>APY</span>
                            <Info className="w-3 h-3" />
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="pt-8 text-center">
                          <div className="text-gray-400 text-sm">No data to display</div>
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
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Markets</h3>
            <p className="text-gray-600">Market data will be displayed here</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity History</h3>
            <p className="text-gray-600">Transaction history will be displayed here</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !portfolio && (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Loading portfolio..." />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}