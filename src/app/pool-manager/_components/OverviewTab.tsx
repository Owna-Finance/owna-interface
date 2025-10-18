'use client';

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useUserPools } from '@/hooks/useUserPools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrendingUp, Droplets, DollarSign, BarChart3, ExternalLink } from 'lucide-react';
import { formatUnits } from 'viem';

export function OverviewTab() {
  const { address } = useAccount();
  const { pools, isLoading, error } = useUserPools();

  // Calculate stats from user pools
  const stats = useMemo(() => {
    if (!pools || pools.length === 0) {
      return {
        totalPools: 0,
        totalTVL: 0,
        totalYield: 0,
        avgAPY: 0
      };
    }

    const totalTVL = pools.reduce((acc, pool) => {
      const reserve0Value = parseFloat(formatUnits(pool.reserve0, 18));
      const reserve1Value = parseFloat(formatUnits(pool.reserve1, 18));
      return acc + reserve0Value + reserve1Value;
    }, 0);

    return {
      totalPools: pools.length,
      totalTVL,
      totalYield: 0, // TODO: Calculate from yield distribution events
      avgAPY: 18.5 // TODO: Calculate based on actual yield data
    };
  }, [pools]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading your pools..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading pools</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Total Pools</CardTitle>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalPools}</div>
            <p className="text-xs text-gray-500 mt-1">Active liquidity pools</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Total TVL</CardTitle>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ${stats.totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total value locked</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Total Yield</CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              +${stats.totalYield.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Yield distributed</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Avg APY</CardTitle>
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.avgAPY}%</div>
            <p className="text-xs text-gray-500 mt-1">Average annual yield</p>
          </CardContent>
        </Card>
      </div>

      {/* Pools List */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <CardTitle className="text-white">Your Liquidity Pools</CardTitle>
          <CardDescription className="text-gray-400">
            DEX pools where you are the property owner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pools.length === 0 ? (
            <div className="text-center py-12">
              <Droplets className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Pools Found</h3>
              <p className="text-gray-400 mb-6">
                You don't own any liquidity pools yet. Create a YRT series and add liquidity to the DEX.
              </p>
              <Button
                onClick={() => window.location.href = '/add-property'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create YRT Series
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pools.map((pool) => (
                <div
                  key={pool.poolAddress}
                  className="bg-[#2A2A2A]/30 border border-[#3A3A3A] rounded-xl p-5 hover:bg-[#2A2A2A]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {pool.propertyName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {pool.token0Symbol} / {pool.token1Symbol}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">TVL</p>
                        <p className="text-lg font-semibold text-white">
                          ${parseFloat(pool.tvl).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-white">
                          ${parseFloat(pool.price).toFixed(4)}
                        </p>
                      </div>
                      <a
                        href={`https://sepolia.basescan.org/address/${pool.poolAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-[#3A3A3A] rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="mt-4 pt-4 border-t border-[#3A3A3A] grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reserve {pool.token0Symbol}</p>
                      <p className="text-sm font-medium text-gray-300">
                        {parseFloat(formatUnits(pool.reserve0, 18)).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reserve {pool.token1Symbol}</p>
                      <p className="text-sm font-medium text-gray-300">
                        {parseFloat(formatUnits(pool.reserve1, 18)).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Swap Fee</p>
                      <p className="text-sm font-medium text-gray-300">
                        {(Number(pool.swapFee) / 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pool Address</p>
                      <p className="text-sm font-mono text-gray-300">
                        {pool.poolAddress.slice(0, 6)}...{pool.poolAddress.slice(-4)}
                      </p>
                    </div>
                  </div>

                  {/* YRT Series Badge */}
                  {pool.isYRTPool && pool.seriesId && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        YRT Series #{pool.seriesId.toString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
