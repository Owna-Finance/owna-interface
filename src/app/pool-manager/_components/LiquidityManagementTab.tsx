'use client';

import { useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useAddLiquidity } from '@/hooks/useAddLiquidity';
import { useUserPools } from '@/hooks/useUserPools';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Droplets, Plus, Info } from 'lucide-react';
import { formatUnits } from 'viem';
import Image from 'next/image';

export function LiquidityManagementTab() {
  const { address } = useAccount();
  const { addLiquidity, approveToken, useTokenAllowance, checkNeedsApproval } = useAddLiquidity();
  const { pools, isLoading: poolsLoading } = useUserPools();
  const queryClient = useQueryClient();

  const [selectedPool, setSelectedPool] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [approvalStep, setApprovalStep] = useState<'none' | 'tokenA' | 'tokenB' | 'complete'>('none');

  const currentPool = pools.find(p => p.poolAddress === selectedPool);

  // Check token allowances
  const { data: tokenAAllowance } = useTokenAllowance({
    tokenAddress: currentPool?.token0 as `0x${string}`,
    amount: amountA || '0',
    userAddress: address as `0x${string}`,
  });

  const { data: tokenBAllowance } = useTokenAllowance({
    tokenAddress: currentPool?.token1 as `0x${string}`,
    amount: amountB || '0',
    userAddress: address as `0x${string}`,
  });

  // Check if approvals are needed
  const needsTokenAApproval = currentPool && amountA && address
    ? checkNeedsApproval(tokenAAllowance as bigint, amountA)
    : false;

  const needsTokenBApproval = currentPool && amountB && address
    ? checkNeedsApproval(tokenBAllowance as bigint, amountB)
    : false;

  const needsAnyApproval = needsTokenAApproval || needsTokenBApproval;

  // Auto-calculate amountB based on pool ratio when amountA changes
  const calculateAmountB = (amountAValue: string) => {
    if (!currentPool || !amountAValue || parseFloat(amountAValue) <= 0) return '';

    const amountANum = parseFloat(amountAValue);
    const reserve0 = parseFloat(formatUnits(currentPool.reserve0, 18));
    const reserve1 = parseFloat(formatUnits(currentPool.reserve1, 18));

    if (reserve0 > 0 && reserve1 > 0) {
      // Calculate equivalent amountB based on pool ratio
      const equivalentAmountB = (amountANum * reserve1) / reserve0;
      return equivalentAmountB.toFixed(6);
    }

    return '';
  };

  // Auto-update amountB when amountA changes (and vice versa)
  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    const calculatedB = calculateAmountB(value);
    if (calculatedB) {
      setAmountB(calculatedB);
    }
  };

  const handleAmountBChange = (value: string) => {
    setAmountB(value);
    if (!currentPool || !value || parseFloat(value) <= 0) return;

    const amountBNum = parseFloat(value);
    const reserve0 = parseFloat(formatUnits(currentPool.reserve0, 18));
    const reserve1 = parseFloat(formatUnits(currentPool.reserve1, 18));

    if (reserve0 > 0 && reserve1 > 0) {
      // Calculate equivalent amountA based on pool ratio
      const equivalentAmountA = (amountBNum * reserve0) / reserve1;
      setAmountA(equivalentAmountA.toFixed(6));
    }
  };

  const handleAddLiquidity = async () => {
    if (!address || !selectedPool || !amountA || !amountB || !currentPool) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate amounts
    if (parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
      toast.error('Amounts must be greater than 0');
      return;
    }

    try {
      // Step 1: Approve tokens if needed (one by one for proper fee estimation)
      if (needsAnyApproval) {
        setIsApproving(true);

        // Approve Token A first (if needed)
        if (needsTokenAApproval) {
          setApprovalStep('tokenA');
          toast.loading(`Approving ${currentPool.token0Symbol}...`, { id: 'add-liquidity' });

          try {
            await approveToken({
              tokenAddress: currentPool.token0,
              amount: amountA,
              userAddress: address
            });

            toast.success(`${currentPool.token0Symbol} approved!`, { id: 'add-liquidity' });

            // Refetch allowance to get updated value
            queryClient.invalidateQueries({
              queryKey: ['readContract']
            });

            // Wait for approval to be processed
            await new Promise(resolve => setTimeout(resolve, 2000));

          } catch (error) {
            throw new Error(`Failed to approve ${currentPool.token0Symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        // Approve Token B second (if needed)
        if (needsTokenBApproval) {
          setApprovalStep('tokenB');
          toast.loading(`Approving ${currentPool.token1Symbol}...`, { id: 'add-liquidity' });

          try {
            await approveToken({
              tokenAddress: currentPool.token1,
              amount: amountB,
              userAddress: address
            });

            toast.success(`${currentPool.token1Symbol} approved!`, { id: 'add-liquidity' });

            // Refetch allowance to get updated value
            queryClient.invalidateQueries({
              queryKey: ['readContract']
            });

            // Wait for approval to be processed
            await new Promise(resolve => setTimeout(resolve, 2000));

          } catch (error) {
            throw new Error(`Failed to approve ${currentPool.token1Symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        setApprovalStep('complete');
        toast.success('All tokens approved! Adding liquidity...', { id: 'add-liquidity' });
      }

      // Step 2: Add liquidity
      setIsApproving(false);
      setIsAdding(true);
      toast.loading('Adding liquidity to pool...', { id: 'add-liquidity' });

      await addLiquidity({
        tokenA: currentPool.token0,
        tokenB: currentPool.token1,
        amountADesired: amountA,
        amountBDesired: amountB,
        amountAMin: (parseFloat(amountA) * 0.95).toString(),
        amountBMin: (parseFloat(amountB) * 0.95).toString(),
        to: address,
        deadline: (Math.floor(Date.now() / 1000) + 1200).toString(), // 20 minutes in seconds
        propertyName: currentPool.propertyName,
        propertyOwner: address
      });

      toast.success('Liquidity added successfully!', { id: 'add-liquidity' });

      // Reset form
      setAmountA('');
      setAmountB('');
      setSelectedPool('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add liquidity';

      // Check if it's an approval error
      if (errorMessage.includes('allowance') || errorMessage.includes('approval')) {
        toast.error('Token approval failed', {
          id: 'add-liquidity',
          description: 'Please check your wallet and try again',
        });
      } else {
        toast.error('Failed to add liquidity', {
          id: 'add-liquidity',
          description: errorMessage,
        });
      }
    } finally {
      setIsApproving(false);
      setIsAdding(false);
      setApprovalStep('none');
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
              disabled={isLoading || pools.length === 0}
            >
              <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                <SelectValue placeholder="Choose a pool..." />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                {pools.map((pool) => (
                  <SelectItem
                    key={pool.poolAddress}
                    value={pool.poolAddress}
                    className="text-white hover:bg-[#3A3A3A] py-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-[#3A3A3A] rounded-full flex items-center justify-center flex-shrink-0">
                        <Image 
                          src="/Images/Logo/logo_YRT.jpg" 
                          alt="YRT Logo" 
                          width={16} 
                          height={16} 
                          className="rounded-full"
                        />
                      </div>
                      <span>{pool.propertyName} ({pool.token0Symbol}/{pool.token1Symbol})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pools.length === 0 && (
              <p className="text-xs text-gray-500">No pools found. Create a YRT series and add liquidity first.</p>
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
                      onChange={(e) => handleAmountAChange(e.target.value)}
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
                    Pool reserve: {parseFloat(formatUnits(currentPool.reserve0, 18)).toFixed(2)} {currentPool.token0Symbol}
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
                      onChange={(e) => handleAmountBChange(e.target.value)}
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
                    Pool reserve: {parseFloat(formatUnits(currentPool.reserve1, 18)).toFixed(2)} {currentPool.token1Symbol}
                  </p>
                </div>
              </div>

              {/* Approval Status */}
              {needsAnyApproval && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="flex-1 space-y-2 text-sm">
                      <p className="text-yellow-400 font-medium">
                        {isApproving ? 'Approving Tokens...' : 'Approvals Required'}
                      </p>
                      <div className="space-y-1">
                        {needsTokenAApproval && (
                          <p className={`${isApproving && approvalStep === 'tokenA' ? 'text-yellow-300 font-medium' : 'text-gray-400'} ${isApproving && approvalStep !== 'tokenA' && approvalStep !== 'none' ? 'line-through' : ''}`}>
                            {isApproving && approvalStep === 'tokenA' ? '→ ' : '• '} Approve {currentPool.token0Symbol}
                          </p>
                        )}
                        {needsTokenBApproval && (
                          <p className={`${isApproving && approvalStep === 'tokenB' ? 'text-yellow-300 font-medium' : 'text-gray-400'} ${isApproving && approvalStep === 'complete' ? 'line-through' : ''}`}>
                            {isApproving && approvalStep === 'tokenB' ? '→ ' : '• '} Approve {currentPool.token1Symbol}
                          </p>
                        )}
                        <p className="text-gray-400">
                          {isApproving && approvalStep === 'complete' ? '✓ ' : ''}Add Liquidity
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs">
                        {isApproving
                          ? 'Please confirm each transaction in your wallet. Network fees will be estimated per transaction.'
                          : 'Each token approval requires a separate transaction with its own network fee.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Panel */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="flex-1 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Pool Ratio</span>
                      <span className="text-white font-medium">
                        1 {currentPool.token0Symbol} = {
                          currentPool.reserve0 > BigInt(0)
                            ? (parseFloat(formatUnits(currentPool.reserve1, 18)) / parseFloat(formatUnits(currentPool.reserve0, 18))).toFixed(4)
                            : '0.0000'
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
                {isApproving && approvalStep === 'tokenA' ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Approving {currentPool?.token0Symbol}...
                  </>
                ) : isApproving && approvalStep === 'tokenB' ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Approving {currentPool?.token1Symbol}...
                  </>
                ) : isAdding ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Adding Liquidity...
                  </>
                ) : needsAnyApproval ? (
                  <>
                    <Droplets className="w-4 h-4 mr-2" />
                    {needsTokenAApproval && needsTokenBApproval
                      ? 'Approve Both Tokens & Add Liquidity'
                      : `Approve ${needsTokenAApproval ? currentPool?.token0Symbol : currentPool?.token1Symbol} & Add Liquidity`
                    }
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
