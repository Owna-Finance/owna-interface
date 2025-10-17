'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAddLiquidity } from '@/hooks/useAddLiquidity';
import { useAllPools } from '@/hooks/useAllPools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Droplets, Plus, ArrowRight, Info } from 'lucide-react';

export function LiquidityManagementTab() {
  const { address } = useAccount();
  const { addLiquidity, approveToken } = useAddLiquidity();
  const { pools, isLoading: poolsLoading } = useAllPools();

  const [selectedPool, setSelectedPool] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [userPools, setUserPools] = useState<any[]>([]);

  useEffect(() => {
    if (pools.length > 0) {
      const yrtPools = pools.filter(pool => pool.isYRTPool);
      setUserPools(yrtPools);
    }
  }, [pools]);

  const currentPool = userPools.find(p => p.address === selectedPool);

  const handleAddLiquidity = async () => {
    if (!address || !selectedPool || !amountA || !amountB) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsApproving(true);
      toast.loading('Approving tokens...', { id: 'add-liquidity' });

      // Approve tokens first
      await approveToken({
        tokenAddress: currentPool.token0Address,
        amount: amountA,
        userAddress: address
      });
      await approveToken({
        tokenAddress: currentPool.token1Address,
        amount: amountB,
        userAddress: address
      });

      setIsApproving(false);
      setIsAdding(true);
      toast.loading('Adding liquidity...', { id: 'add-liquidity' });

      // Add liquidity
      await addLiquidity({
        tokenA: currentPool.token0Address,
        tokenB: currentPool.token1Address,
        amountADesired: amountA,
        amountBDesired: amountB,
        amountAMin: (parseFloat(amountA) * 0.95).toString(),
        amountBMin: (parseFloat(amountB) * 0.95).toString(),
        to: address,
        deadline: '20',
        propertyName: currentPool.propertyName || '',
        propertyOwner: address
      });

      toast.success('Liquidity added successfully!', { id: 'add-liquidity' });

      setAmountA('');
      setAmountB('');
      setSelectedPool('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add liquidity', {
        id: 'add-liquidity'
      });
    } finally {
      setIsApproving(false);
      setIsAdding(false);
    }
  };

  const isLoading = isApproving || isAdding;

  return (
    <div className="space-y-6">
      {/* Add Liquidity Form */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-blue-400" />
            <div>
              <CardTitle className="text-white">Add Liquidity to Pool</CardTitle>
              <CardDescription className="text-gray-400">
                Increase pool liquidity to improve trading and earn fees
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pool Selection */}
          <div className="space-y-2">
            <Label htmlFor="pool" className="text-gray-300">Select Pool</Label>
            <Select
              value={selectedPool}
              onValueChange={setSelectedPool}
              disabled={isLoading || userPools.length === 0}
            >
              <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                <SelectValue placeholder="Choose a pool..." />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                {userPools.map((pool) => (
                  <SelectItem
                    key={pool.address}
                    value={pool.address}
                    className="text-white hover:bg-[#3A3A3A]"
                  >
                    {pool.propertyName || `${pool.token0Symbol}/${pool.token1Symbol}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userPools.length === 0 && (
              <p className="text-xs text-gray-500">No pools available. Create a property first.</p>
            )}
          </div>

          {/* Token Inputs */}
          {currentPool && (
            <>
              <div className="space-y-4">
                {/* Token A */}
                <div className="space-y-2">
                  <Label htmlFor="amountA" className="text-gray-300">
                    Amount {currentPool.token0Symbol}
                  </Label>
                  <div className="relative">
                    <Input
                      id="amountA"
                      type="number"
                      value={amountA}
                      onChange={(e) => setAmountA(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.01"
                      className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white placeholder-gray-500 pr-20"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      {currentPool.token0Symbol}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Available: {parseFloat(currentPool.reserve0 || '0').toFixed(2)} {currentPool.token0Symbol}
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center">
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Token B */}
                <div className="space-y-2">
                  <Label htmlFor="amountB" className="text-gray-300">
                    Amount {currentPool.token1Symbol}
                  </Label>
                  <div className="relative">
                    <Input
                      id="amountB"
                      type="number"
                      value={amountB}
                      onChange={(e) => setAmountB(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.01"
                      className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white placeholder-gray-500 pr-20"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      {currentPool.token1Symbol}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Available: {parseFloat(currentPool.reserve1 || '0').toFixed(2)} {currentPool.token1Symbol}
                  </p>
                </div>
              </div>

              {/* Info Panel */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Pool Ratio</span>
                      <span className="text-white font-medium">
                        1 {currentPool.token0Symbol} = {
                          (parseFloat(currentPool.reserve1) / parseFloat(currentPool.reserve0)).toFixed(4)
                        } {currentPool.token1Symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Your Pool Share</span>
                      <span className="text-white font-medium">~25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Slippage Tolerance</span>
                      <span className="text-white font-medium">5%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddLiquidity}
                disabled={isLoading || !amountA || !amountB}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isApproving ? 'Approving Tokens...' : 'Adding Liquidity...'}
                  </>
                ) : (
                  <>
                    <Droplets className="w-4 h-4 mr-2" />
                    Add Liquidity
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <CardTitle className="text-white">How Liquidity Works</CardTitle>
          <CardDescription className="text-gray-400">
            Understanding DEX liquidity provision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-medium">Provide Liquidity</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Add equal value of YRT and stablecoin (USDC/IDRX) to the pool
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-medium">Receive LP Tokens</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Get LP tokens representing your share of the pool
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white font-medium">Earn Fees</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Earn 0.3% fee on all swaps proportional to your pool share
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
