'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { useAddLiquidity, useDepositYield, usePoolDetails } from '@/hooks';
import { useAllPools } from '@/hooks/useAllPools';
import { useYRTSeries } from '@/hooks/useYRTSeries';
import { isBaseSepolia, switchToBaseSepolia } from '@/utils/chain-switch';
import { CHAIN } from '@/constants/chain';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  TrendingUp,
  DollarSign,
  Settings,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export default function PoolManagerPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);

  // Pool management hooks
  const { addLiquidity, approveToken, useTokenAllowance, checkNeedsApproval } = useAddLiquidity();
  const { depositYield, approveToken: approveYieldToken } = useDepositYield();
  const { pools, isLoading: poolsLoading, error: poolsError } = useAllPools();
  const { allSeriesIds, useSeriesInfo } = useYRTSeries();

  
  // State for forms
  const [activeTab, setActiveTab] = useState('overview');
  const [userPools, setUserPools] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);

  const handleSwitchChain = async () => {
    if (!address) return;
    setIsSwitchingChain(true);
    try {
      await switchToBaseSepolia();
    } catch (error) {
      toast.error('Failed to switch chain');
    } finally {
      setIsSwitchingChain(false);
    }
  };

  // Filter pools where user is the property owner and load properties
  useEffect(() => {
    if (pools.length > 0 && address) {
      // Filter pools that are YRT pools (user manages these)
      const yrtPools = pools.filter(pool => pool.isYRTPool);

      // Map pools to show property names instead of generic names
      const poolsWithPropertyNames = yrtPools.map(pool => ({
        ...pool,
        displayName: pool.propertyName || `${pool.token0Symbol}/${pool.token1Symbol}`,
        // Show property name if available, otherwise use token symbols
        displayDescription: pool.propertyName
          ? `${pool.token0Symbol}/${pool.token1Symbol}`
          : `Liquidity Pool ${pool.address.slice(0, 6)}...${pool.address.slice(-4)}`
      }));

      setUserPools(poolsWithPropertyNames);
    }
  }, [pools, address]);

  // Use fixed hooks for first few series (following Rules of Hooks)
  const seriesInfo0 = useSeriesInfo(0);
  const seriesInfo1 = useSeriesInfo(1);
  const seriesInfo2 = useSeriesInfo(2);
  const seriesInfo3 = useSeriesInfo(3);
  const seriesInfo4 = useSeriesInfo(4);

  // Load properties for deposit yield
  useEffect(() => {
    if (allSeriesIds && Array.isArray(allSeriesIds) && allSeriesIds.length > 0) {
      const seriesHooks = [seriesInfo0, seriesInfo1, seriesInfo2, seriesInfo3, seriesInfo4];

      const propertiesData = allSeriesIds.slice(0, 5).map((seriesId: bigint, index: number) => {
        const seriesInfo = seriesHooks[index];
        return {
          seriesId: Number(seriesId),
          info: { info: seriesInfo.data }
        };
      }).filter(prop => {
      return prop.info &&
             typeof prop.info === 'object' &&
             prop.info.info &&
             typeof prop.info.info === 'object' &&
             prop.info.info.isActive === true;
    });

      setProperties(propertiesData);
    }
  }, [allSeriesIds, seriesInfo0.data, seriesInfo1.data, seriesInfo2.data, seriesInfo3.data, seriesInfo4.data]);

  if (!address) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to manage pools</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Pool Manager</h1>
              <p className="text-gray-400">
                Manage your property liquidity pools and yield deposits
              </p>
            </div>
            <Button
              onClick={handleSwitchChain}
              disabled={isSwitchingChain || isBaseSepolia(chainId)}
              variant={isBaseSepolia(chainId) ? "outline" : "default"}
            >
              {isSwitchingChain ? 'Switching...' : isBaseSepolia(chainId) ? 'Base Sepolia ✓' : 'Switch Network'}
            </Button>
          </div>
        </div>

        {/* Chain Warning */}
        {!isBaseSepolia(chainId) && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-yellow-500 font-medium text-sm">
                  Wrong Network Detected
                </p>
                <p className="text-yellow-600 text-xs">
                  Please switch to {CHAIN.name} (Chain ID: {CHAIN.id})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="add-liquidity" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Liquidity</span>
            </TabsTrigger>
            <TabsTrigger value="deposit-yield" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Deposit Yield</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Withdraw</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Pools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{userPools.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total TVL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$125,000</div>
                </CardContent>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Yield</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">+$2,450</div>
                </CardContent>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">APY Avg</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">18.5%</div>
                </CardContent>
              </Card>
            </div>

            {/* Debug Information */}
            <Card className="bg-[#0A0A0A] border-[#2A2A2A] mb-6">
              <CardHeader>
                <CardTitle className="text-white">Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pools Loading:</span>
                    <span className="text-white">{poolsLoading ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pools Error:</span>
                    <span className="text-white">{poolsError || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Raw Pools Count:</span>
                    <span className="text-white">{pools.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User Pools Count:</span>
                    <span className="text-white">{userPools.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="text-white">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</span>
                  </div>
                </div>

                {/* Raw pools data for debugging */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Raw Pools Data:</h4>
                  <div className="bg-[#111111] p-3 rounded-lg text-xs text-gray-300 max-h-40 overflow-y-auto">
                    {pools.length > 0 ? (
                      <pre>{JSON.stringify(pools, (key, value) =>
                        typeof value === 'bigint' ? value.toString() : value
                      , 2)}</pre>
                    ) : (
                      <p>No pools data available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Pools List */}
            <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Your Liquidity Pools</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage the liquidity pools you've created
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userPools.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">No pools found</p>
                    <Button
                      onClick={() => setActiveTab('add-liquidity')}
                      className="bg-white hover:bg-gray-200 text-black"
                    >
                      Create Your First Pool
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPools.map((pool, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-[#111111] rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{pool.displayName}</div>
                            <div className="text-sm text-gray-400">
                              {pool.displayDescription}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-white font-medium">
                              ${(parseFloat(pool.reserve0) * 1000 + parseFloat(pool.reserve1) * 1000).toFixed(0)}
                            </div>
                            <div className="text-xs text-green-400">+12.5%</div>
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Liquidity Tab */}
          <TabsContent value="add-liquidity" className="space-y-6">
            <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Add Liquidity to Pool</CardTitle>
                <CardDescription className="text-gray-400">
                  Add tokens to existing pools to increase liquidity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pool Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Pool
                    </label>
                    <select className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white">
                      <option value="">Choose a pool...</option>
                      {userPools.map((pool, index) => (
                        <option key={pool.address || index} value={pool.address}>
                          {pool.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Token Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Token to Add
                    </label>
                    <select className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white">
                      <option value={CONTRACTS.USDC}>USDC</option>
                      <option value={CONTRACTS.IDRX}>IDRX</option>
                    </select>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500"
                  />
                </div>

                {/* Pool Info */}
                <div className="p-4 bg-[#111111] rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Pool Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Pool Size:</span>
                      <span className="text-white">$15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Your Share:</span>
                      <span className="text-white">25%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected LP Tokens:</span>
                      <span className="text-white">150.0</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-white hover:bg-gray-200 text-black font-medium">
                  Add Liquidity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposit Yield Tab */}
          <TabsContent value="deposit-yield" className="space-y-6">
            <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Deposit Yield</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribute yield to YRT token holders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Property
                    </label>
                    <select className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white">
                      <option value="">Choose a property...</option>
                      {properties.map((property) => (
                        <option key={property.seriesId} value={property.seriesId}>
                          {property.info?.info?.propertyName || `Property #${property.seriesId}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Period Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Period ID
                    </label>
                    <select className="w-full px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white">
                      <option value="">Select period...</option>
                      <option value="current">Current Period</option>
                      <option value="next">Next Period</option>
                    </select>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yield Amount (USDC)
                  </label>
                  <input
                    type="number"
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500"
                  />
                </div>

                {/* Yield Info */}
                <div className="p-4 bg-[#111111] rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Distribution Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Holders:</span>
                      <span className="text-white">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Yield Per Holder:</span>
                      <span className="text-white">~2.22 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Series ID:</span>
                      <span className="text-white">-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Period ID:</span>
                      <span className="text-white">-</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-white hover:bg-gray-200 text-black font-medium">
                  Deposit Yield
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-white">Withdraw from Pool</CardTitle>
                <CardDescription className="text-gray-400">
                  Withdraw USDC/IDRX from your pools (Property Owner Only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-4">Withdraw functionality coming soon</p>
                  <p className="text-sm text-gray-500">
                    Property owners can withdraw USDC/IDRX from pools for operational needs
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}