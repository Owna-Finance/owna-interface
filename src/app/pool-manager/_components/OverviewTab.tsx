'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAllPools } from '@/hooks/useAllPools';
import { useYRTSeries } from '@/hooks/useYRTSeries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TrendingUp, Droplets, DollarSign, BarChart3 } from 'lucide-react';

export function OverviewTab() {
  const { address } = useAccount();
  const { pools, isLoading: poolsLoading } = useAllPools();
  const { allSeriesIds, isLoadingIds } = useYRTSeries();

  const [userPools, setUserPools] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPools: 0,
    totalTVL: 0,
    totalYield: 0,
    avgAPY: 0
  });

  useEffect(() => {
    if (pools.length > 0 && address) {
      const yrtPools = pools.filter(pool => pool.isYRTPool);
      const poolsWithPropertyNames = yrtPools.map(pool => ({
        ...pool,
        displayName: pool.propertyName || `${pool.token0Symbol}/${pool.token1Symbol}`,
        displayDescription: pool.propertyName
          ? `${pool.token0Symbol}/${pool.token1Symbol}`
          : `Pool ${pool.address.slice(0, 6)}...${pool.address.slice(-4)}`
      }));

      setUserPools(poolsWithPropertyNames);

      // Calculate stats (mock for now)
      setStats({
        totalPools: poolsWithPropertyNames.length,
        totalTVL: poolsWithPropertyNames.reduce((acc, pool) => {
          return acc + (parseFloat(pool.reserve0 || '0') + parseFloat(pool.reserve1 || '0'));
        }, 0),
        totalYield: 2450,
        avgAPY: 18.5
      });
    }
  }, [pools, address]);

  if (poolsLoading || isLoadingIds) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading pool overview..." />
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
            Properties with active DEX liquidity pools
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userPools.length === 0 ? (
            <div className="text-center py-12">
              <Droplets className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Pools Found</h3>
              <p className="text-gray-400 mb-6">
                Create a property and add liquidity to get started
              </p>
              <Button
                onClick={() => window.location.href = '/add-property'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Property
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userPools.map((pool, index) => (
                <div
                  key={index}
                  className="bg-[#2A2A2A]/30 border border-[#3A3A3A] rounded-xl p-5 hover:bg-[#2A2A2A]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Droplets className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {pool.displayName}
                        </h3>
                        <p className="text-sm text-gray-400">{pool.displayDescription}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">TVL</p>
                        <p className="text-lg font-semibold text-white">
                          ${((parseFloat(pool.reserve0 || '0') + parseFloat(pool.reserve1 || '0'))).toFixed(0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">APY</p>
                        <p className="text-lg font-semibold text-green-400">12.5%</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#3A3A3A] text-white hover:bg-[#3A3A3A]"
                      >
                        Manage
                      </Button>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="mt-4 pt-4 border-t border-[#3A3A3A] grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reserve {pool.token0Symbol}</p>
                      <p className="text-sm font-medium text-gray-300">
                        {parseFloat(pool.reserve0 || '0').toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reserve {pool.token1Symbol}</p>
                      <p className="text-sm font-medium text-gray-300">
                        {parseFloat(pool.reserve1 || '0').toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pool Address</p>
                      <p className="text-sm font-mono text-gray-300">
                        {pool.address.slice(0, 6)}...{pool.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
