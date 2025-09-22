'use client';

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { RefreshCw, Wallet, TrendingUp, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
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

  const handleRefresh = () => {
    refreshPortfolio();
  };

  const summary = getPortfolioSummary();

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
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
      <PageHeader
        title="Dashboard"
        subtitle="Track your portfolio performance and manage your assets"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Balance"
          value={formatCurrency(summary.totalValue)}
          icon={<Wallet className="w-5 h-5" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="24h Change"
          value={formatCurrency(summary.dayChange * summary.totalValue / 100)}
          change={{
            value: summary.dayChangePercent,
            type: summary.dayChangePercent >= 0 ? 'positive' : 'negative'
          }}
          icon={<TrendingUp className="w-5 h-5" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Assets"
          value={summary.totalTokens}
          icon={<PieChart className="w-5 h-5" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Top Holding"
          value={summary.topHolding?.value ? formatCurrency(summary.topHolding.value) : '$0.00'}
          icon={<Wallet className="w-5 h-5" />}
          isLoading={isLoading}
        />
      </div>

      {/* Asset Allocation */}
      {portfolio && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Asset Allocation
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Crypto</span>
                <span className="text-sm font-medium text-black dark:text-white">
                  {formatPercentage(portfolio.allocations.crypto, 1, false)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${portfolio.allocations.crypto}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Stablecoins</span>
                <span className="text-sm font-medium text-black dark:text-white">
                  {formatPercentage(portfolio.allocations.stablecoin, 1, false)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${portfolio.allocations.stablecoin}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">RWA Tokens</span>
                <span className="text-sm font-medium text-black dark:text-white">
                  {formatPercentage(portfolio.allocations.rwa, 1, false)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${portfolio.allocations.rwa}%` }}
                />
              </div>
            </div>
          </div>

          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Daily</span>
                <span className={`text-sm font-medium ${
                  portfolio.performance.daily >= 0 ? 'metric-positive' : 'metric-negative'
                }`}>
                  {formatPercentage(portfolio.performance.daily)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly</span>
                <span className={`text-sm font-medium ${
                  portfolio.performance.weekly >= 0 ? 'metric-positive' : 'metric-negative'
                }`}>
                  {formatPercentage(portfolio.performance.weekly)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly</span>
                <span className={`text-sm font-medium ${
                  portfolio.performance.monthly >= 0 ? 'metric-positive' : 'metric-negative'
                }`}>
                  {formatPercentage(portfolio.performance.monthly)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token Holdings */}
      {portfolio && (
        <div className="dashboard-card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Token Holdings
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Balance</th>
                  <th>Value</th>
                  <th>% of Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.tokens.map(holding => {
                  const percentage = (holding.value / portfolio.totalBalance) * 100;
                  return (
                    <tr key={holding.tokenId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                          <span className="font-medium text-black dark:text-white">
                            {holding.tokenId.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="font-mono text-sm">
                        {holding.balance.toFixed(4)}
                      </td>
                      <td className="font-medium">
                        {formatCurrency(holding.value)}
                      </td>
                      <td>
                        {formatPercentage(percentage, 1, false)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !portfolio && (
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" text="Loading portfolio..." />
        </div>
      )}
    </DashboardLayout>
  );
}