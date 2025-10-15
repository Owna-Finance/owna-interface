'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount, useBalance } from 'wagmi';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useDEXFactory } from '@/utils/dex-discovery';
import { useYRTSeries } from '@/hooks/useYRTSeries';
import { useDEX } from '@/hooks/useDEX';
import { useAllPools } from '@/hooks/useAllPools';
import { getExplorerUrl } from '@/constants/chain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Plus, TrendingUp, Loader2 } from 'lucide-react';
import { formatUnits } from 'viem';

interface Pool {
  address: `0x${string}`;
  tokenA: `0x${string}`;
  tokenB: `0x${string}`;
  tokenASymbol: string;
  tokenBSymbol: string;
  tokenAName?: string;
  tokenBName?: string;
  reserveA: string;
  reserveB: string;
  apr: string;
  propertyName?: string;
  isYRTPool: boolean;
}

export default function PoolsPage() {
  const { address, isConnected } = useAccount();
  const { data: factoryAddress, isLoading: factoryLoading } = useDEXFactory();
  const factoryAddressStr = factoryAddress as `0x${string}` | undefined;
  const { useGetPool } = useDEX();
  const { pools: allPools, isLoading: poolsLoading } = useAllPools();
  const { useSeriesIdByToken, useSeriesInfoWithSlug } = useYRTSeries();

  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [poolCount, setPoolCount] = useState(0);

  // Update pools when allPools data changes
  useEffect(() => {
    if (allPools && allPools.length > 0) {
      // Convert pools data to display format
      const formattedPools: Pool[] = allPools.map(pool => ({
        address: pool.address,
        tokenA: pool.token0,
        tokenB: pool.token1,
        tokenASymbol: pool.token0Symbol,
        tokenBSymbol: pool.token1Symbol,
        tokenAName: pool.token0Name,
        tokenBName: pool.token1Name,
        reserveA: pool.reserve0,
        reserveB: pool.reserve1,
        apr: '0.00', // TODO: Calculate actual APR from fees
        propertyName: pool.propertyName,
        isYRTPool: pool.isYRTPool,
      }));

      setPools(formattedPools);
      setPoolCount(formattedPools.length);
    } else {
      // Set mock pools for demonstration if no real pools available
      const mockPools: Pool[] = [
        {
          address: '0x1234567890123456789012345678901234567890',
          tokenA: CONTRACTS.USDC,
          tokenB: '0x4e0f63A8a31156DE5d232F47AD7aAFd2C9014991', // YRT Sudirman
          tokenASymbol: 'USDC',
          tokenBSymbol: 'YRT-SDR',
          tokenAName: 'USD Coin',
          tokenBName: 'YRT Sudirman',
          reserveA: '100000.00',
          reserveB: '50000.00',
          apr: '12.5',
          propertyName: 'Sudirman Apartment',
          isYRTPool: true,
        },
      ];
      setPools(mockPools);
      setPoolCount(mockPools.length);
    }
    setIsLoading(false);
  }, [allPools]);

  const handleAddLiquidity = (pool: Pool) => {
    // Navigate to add liquidity page with pool pre-selected
    window.location.href = `/trading/add-liquidity?tokenA=${pool.tokenA}&tokenB=${pool.tokenB}`;
  };

  const handleSwap = (pool: Pool) => {
    // Navigate to swap page with pool pre-selected
    window.location.href = `/trading/swap?tokenA=${pool.tokenA}&tokenB=${pool.tokenB}`;
  };

  if (!isConnected) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400">Please connect your wallet to view pools</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Trading Pools</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-2">
                Available liquidity pools for YRT token trading
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {factoryAddressStr && (
                  <p>
                    DEX Factory:
                    <a
                      href={getExplorerUrl('address', factoryAddressStr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-400 hover:text-blue-300"
                    >
                      {factoryAddressStr.slice(0, 8)}...{factoryAddressStr.slice(-6)}
                      <ExternalLink className="inline ml-1 w-3 h-3" />
                    </a>
                  </p>
                )}
                {poolCount > 0 && (
                  <p>
                    Total Pools: <span className="text-white font-medium">{poolCount}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/trading/create-pool'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Pool
            </Button>
          </div>
        </div>

        {/* Pools Grid */}
        {isLoading || poolsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-[#1A1A1A] border-[#2A2A2A]">
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-8 bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pools.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No pools found</p>
            <p className="text-gray-500 text-sm mb-4">
              Create your first liquidity pool to start trading YRT tokens
            </p>
            <Button
              onClick={() => window.location.href = '/trading/create-pool'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Pool
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool, index) => (
              <Card key={index} className="bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span className="text-lg">{pool.tokenASymbol}</span>
                    <span className="text-gray-500">/</span>
                    <span className="text-lg">{pool.tokenBSymbol}</span>
                    {pool.isYRTPool && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        YRT
                      </span>
                    )}
                  </CardTitle>
                  {pool.propertyName && (
                    <p className="text-gray-400 text-sm">{pool.propertyName}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* APR */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">APR</span>
                    <span className="text-green-400 font-medium">{pool.apr}%</span>
                  </div>

                  {/* Token Info */}
                  {(pool.tokenAName || pool.tokenBName) && (
                    <div className="space-y-1">
                      {pool.tokenAName && (
                        <p className="text-xs text-gray-500">{pool.tokenAName}</p>
                      )}
                      {pool.tokenBName && (
                        <p className="text-xs text-gray-500">{pool.tokenBName}</p>
                      )}
                    </div>
                  )}

                  {/* Reserves */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{pool.tokenASymbol} Reserve</span>
                      <span className="text-white">{pool.reserveA}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{pool.tokenBSymbol} Reserve</span>
                      <span className="text-white">{pool.reserveB}</span>
                    </div>
                  </div>

                  {/* Pool Address */}
                  <div className="text-xs text-gray-500">
                    <a
                      href={getExplorerUrl('address', pool.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400"
                    >
                      {pool.address.slice(0, 8)}...{pool.address.slice(-6)}
                      <ExternalLink className="inline ml-1 w-3 h-3" />
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSwap(pool)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Swap
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAddLiquidity(pool)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Add Liquidity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 space-y-4">
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="text-blue-400 font-medium mb-2">About YRT Liquidity Pools</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              YRT liquidity pools enable trading between Yield Property Tokens and stable assets (USDC/IDRX).
              Each pool represents a property investment opportunity, allowing investors to trade tokens
              and earn from rental income distributions.
            </p>
          </div>

          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h3 className="text-green-400 font-medium mb-2">Pool Features</h3>
            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
              <li>Property owner can inject or withdraw stable assets to manage pool price</li>
              <li>LP tokens represent your share of the pool and earn trading fees</li>
              <li>Pool operations are managed through the DEX Router</li>
              <li>All pools support both USDC and IDRX as underlying assets</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}