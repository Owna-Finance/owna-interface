'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useStartNewPeriod } from '@/hooks/useStartNewPeriod';
import { useUserPools } from '@/hooks/useUserPools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export function PeriodManagementTab() {
  const { address } = useAccount();
  const { startNewPeriod, isPending, isConfirming, isSuccess, error: periodError, hash } = useStartNewPeriod();

  // Fetch user pools - exactly like Add Liquidity component  
  const { pools, isLoading: isLoadingPools, error: poolsError } = useUserPools();

  // Extract YRT series from user pools - show all pools for now to debug
  const yrtSeries = useMemo(() => {
    if (!pools) return [];
    
    // Debug: log all pools to see what we have (handle BigInt serialization)
    console.log('All available pools count:', pools.length);
    pools.forEach((pool, index) => {
      console.log(`Pool ${index}:`, {
        propertyName: pool.propertyName,
        isYRTPool: pool.isYRTPool,
        seriesId: pool.seriesId ? pool.seriesId.toString() : 'null',
        token0Symbol: pool.token0Symbol,
        token1Symbol: pool.token1Symbol,
        poolAddress: pool.poolAddress
      });
    });
    
    // Show all pools for now, we'll filter the validation instead
    return pools;
  }, [pools]);

  const isLoadingSeries = isLoadingPools;
  const seriesError = poolsError;

  const [formData, setFormData] = useState({
    poolAddress: '',
    durationSeconds: '2592000' // 30 days in seconds
  });

  // Handle transaction confirmation states
  useEffect(() => {
    if (isConfirming && hash) {
      toast.loading('Confirming transaction on blockchain...', { id: 'start-period' });
    }
  }, [isConfirming, hash]);

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('New period started successfully!', { id: 'start-period' });
      setFormData({ poolAddress: '', durationSeconds: '2592000' });
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (periodError) {
      toast.error(periodError.message || 'Failed to start period', {
        id: 'start-period'
      });
    }
  }, [periodError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!formData.poolAddress || !formData.durationSeconds) {
      toast.error('Please fill in all fields');
      return;
    }

    // Find the selected pool to get its series ID
    const selectedPool = yrtSeries.find(pool => pool.poolAddress === formData.poolAddress);
    if (!selectedPool) {
      toast.error('Please select a property');
      return;
    }
    
    // Debug log for selected pool (handle BigInt serialization)
    console.log('Selected pool for period:', {
      propertyName: selectedPool.propertyName,
      isYRTPool: selectedPool.isYRTPool,
      seriesId: selectedPool.seriesId ? selectedPool.seriesId.toString() : 'null',
      token0Symbol: selectedPool.token0Symbol,
      token1Symbol: selectedPool.token1Symbol,
      poolAddress: selectedPool.poolAddress
    });
    
    // Check if pool has series ID or use a fallback
    let seriesId = selectedPool.seriesId;
    if (!seriesId) {
      // Use fallback series ID 1 for any property without explicit series ID
      seriesId = BigInt(1); 
      console.log(`Property "${selectedPool.propertyName}" does not have seriesId, using fallback series ID: 1`);
      console.log('Token symbols:', selectedPool.token0Symbol, '/', selectedPool.token1Symbol);
    }

    try {
      toast.loading('Starting new period...', { id: 'start-period' });

      await startNewPeriod({
        seriesId: seriesId.toString(),
        durationInSeconds: parseInt(formData.durationSeconds)
      });

      // Success and error handling moved to useEffect
      // The toast will update when transaction is confirmed
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start period', {
        id: 'start-period'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Start New Period Form */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-400" />
            <div>
              <CardTitle className="text-white">Start New Period</CardTitle>
              <CardDescription className="text-gray-400">
                Begin a new fundraising period for an existing YRT series
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="seriesId" className="text-gray-300">Select Property</Label>
                <Select
                  value={formData.poolAddress}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, poolAddress: value }))}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                    <SelectValue placeholder="Choose a property..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    {isLoadingSeries ? (
                      <div className="p-4 text-center text-gray-400">
                        Loading your properties...
                      </div>
                    ) : seriesError ? (
                      <div className="p-4 text-center text-red-400">
                        Error loading properties
                      </div>
                    ) : yrtSeries.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No YRT properties found
                      </div>
                    ) : (
                      yrtSeries.map((pool) => (
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
                            <div className="flex flex-col">
                              <span className="font-medium">{pool.propertyName}</span>
                              <span className="text-xs text-gray-400">
                                {pool.seriesId ? `Series #${pool.seriesId.toString()} • ` : ''}{pool.token0Symbol}/{pool.token1Symbol}
                                {!pool.seriesId && (pool.token0Symbol.includes('YRT') || pool.token0Symbol.includes('OWN')) && (
                                  <span className="text-yellow-400 ml-1">(Will use Series #1)</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationSeconds" className="text-gray-300">
                  Fundraising Duration (Seconds)
                </Label>
                <Input
                  id="durationSeconds"
                  type="number"
                  value={formData.durationSeconds}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationSeconds: e.target.value }))}
                  placeholder="2592000"
                  min="60"
                  max="31536000"
                  className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white placeholder-gray-500"
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500">
                  Enter duration in seconds. Example: 2592000 = 30 days, 86400 = 1 day
                </p>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-blue-400 mb-1">Period Timeline</p>
                  <p className="text-gray-400">
                    Fundraising period allows investors to buy YRT tokens. After maturity, take snapshot
                    to prepare for yield distribution.
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || isConfirming || !address || !formData.poolAddress}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting Transaction...
                </>
              ) : isConfirming ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Confirming on Blockchain...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Start New Period
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Period Information */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <CardTitle className="text-white">Period Lifecycle</CardTitle>
          <CardDescription className="text-gray-400">
            Understanding the fundraising period workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#3A3A3A]"></div>

              <div className="relative space-y-6">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="text-white font-medium">Start Period</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Initialize new fundraising period with maturity date
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="text-white font-medium">Fundraising</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Investors buy YRT tokens via DEX during this period
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center z-10">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="text-white font-medium">Maturity & Snapshot</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Take snapshot at maturity to record holder balances for yield distribution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
