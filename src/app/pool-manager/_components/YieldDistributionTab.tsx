'use client';

import { useState, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { useDepositYield, useDistributeToAllHolders, useUserPools } from '@/hooks';
import { usePeriodInfo } from '@/hooks/usePeriodInfo';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { YRT_FACTORY_ABI } from '@/constants/abis/YRT_FACTORY_Abi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Gift, Send, AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Enhanced Period Item Component
function EnhancedPeriodItem({ 
  periodId, 
  seriesId, 
  basicPeriodInfo, 
  type = 'deposit' 
}: { 
  periodId: bigint; 
  seriesId: string; 
  basicPeriodInfo: any;
  type?: 'deposit' | 'distribute';
}) {
  // Get detailed period info using the hook
  const { data: detailedPeriodInfo } = usePeriodInfo(
    seriesId ? BigInt(seriesId) : BigInt(0), 
    periodId
  );

  // Use basic info as fallback, detailed info if available
  const periodInfo = detailedPeriodInfo || basicPeriodInfo;
  
  if (!periodInfo) return null;

  // Handle BigInt dates properly
  const maturityTimestamp = typeof periodInfo.maturityDate === 'bigint' 
    ? Number(periodInfo.maturityDate) 
    : Number(periodInfo.maturityDate || 0);
  const startedTimestamp = typeof periodInfo.startedAt === 'bigint' 
    ? Number(periodInfo.startedAt) 
    : Number(periodInfo.startedAt || 0);
  
  const maturityDate = new Date(maturityTimestamp * 1000);
  const startedAt = new Date(startedTimestamp * 1000);
  const totalYield = Number(periodInfo.totalYield || 0) / 1e18;
  const yieldClaimed = Number(periodInfo.yieldClaimed || 0) / 1e18;
  const isActive = periodInfo.isActive;
  const isMatured = Date.now() >= maturityTimestamp * 1000;
  const timeRemaining = Math.max(0, Math.ceil((maturityTimestamp * 1000 - Date.now()) / (24 * 60 * 60 * 1000)));
  const yieldProgress = totalYield > 0 ? (yieldClaimed / totalYield) * 100 : 0;

  // Check if dates are valid
  const isValidMaturityDate = !isNaN(maturityDate.getTime()) && maturityTimestamp > 0;
  const isValidStartDate = !isNaN(startedAt.getTime()) && startedTimestamp > 0;

  return (
    <div className="flex flex-col space-y-1.5 w-full min-w-0">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="font-medium text-sm truncate">Period {periodId.toString()}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${
            isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
          {type === 'distribute' && (
            <span className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap ${
              isMatured ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isMatured ? 'Ready' : 'Pending'}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 space-y-0.5 min-w-0">
        <div className="flex justify-between items-center gap-2 min-w-0">
          <span className="flex-shrink-0 text-xs">Started:</span>
          <span className="text-right truncate text-xs">
            {isValidStartDate ? startedAt.toLocaleDateString() : 'Not started'}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2 min-w-0">
          <span className="flex-shrink-0 text-xs">Matures:</span>
          <span className="text-right truncate text-xs">
            {isValidMaturityDate ? maturityDate.toLocaleDateString() : 'No maturity date'}
          </span>
        </div>
        {isValidMaturityDate && !isMatured && timeRemaining > 0 && (
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="flex-shrink-0 text-xs">Time left:</span>
            <span className="text-yellow-400 text-right text-xs">{timeRemaining} days</span>
          </div>
        )}
        {totalYield > 0 && (
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="flex-shrink-0 text-xs">Total Yield:</span>
            <span className="text-blue-400 text-right text-xs truncate">{totalYield.toFixed(2)} USDC</span>
          </div>
        )}
        {yieldClaimed > 0 && (
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="flex-shrink-0 text-xs">Claimed:</span>
            <span className="text-green-400 text-right text-xs truncate">
              {yieldClaimed.toFixed(2)} USDC ({yieldProgress.toFixed(1)}%)
            </span>
          </div>
        )}
        {isValidMaturityDate && isMatured && isActive && type === 'distribute' && (
          <div className="text-green-400 text-xs font-medium mt-1">
            ✓ Ready for distribution
          </div>
        )}
      </div>
    </div>
  );
}

export function YieldDistributionTab() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const {
    depositYield,
    isPending: isDepositPending,
    approveToken,
    useTokenAllowance,
    checkNeedsApproval
  } = useDepositYield();
  const { distributeToAllHolders, isLoading: isDistributePending } = useDistributeToAllHolders();

  // Fetch YRT series from user pools (more reliable approach)
  const { pools, isLoading: isLoadingPools, error: poolsError } = useUserPools();

  // Extract YRT series from pools - show ALL pools for property selection
  const yrtSeries = useMemo(() => {
    if (!pools) return [];
    // Show all pools, not just YRT pools
    return pools;
  }, [pools]);

  const isLoadingSeries = isLoadingPools;
  const seriesError = poolsError;

  const [activeAction, setActiveAction] = useState<'deposit' | 'distribute'>('deposit');
  const [isApproving, setIsApproving] = useState(false);
  const [isAutoDepositing, setIsAutoDepositing] = useState(false);

  const [depositForm, setDepositForm] = useState({
    poolAddress: '',
    periodId: '',
    amount: ''
  });

  const [distributeForm, setDistributeForm] = useState({
    poolAddress: '',
    periodId: ''
  });

  // Type definitions for period data
  interface PeriodInfo {
    maturityDate: bigint;
    startedAt: bigint;
    totalYield: bigint;
    yieldClaimed: bigint;
    isActive: boolean;
  }


  
  // USDC token address for yield deposits
  const USDC_TOKEN = CONTRACTS.USDC;

  // Get series ID from selected pool for deposit
  const selectedDepositPool = yrtSeries.find(pool => pool.poolAddress === depositForm.poolAddress);
  const depositSeriesId = selectedDepositPool?.seriesId?.toString() || (selectedDepositPool ? '1' : '');

  // Fetch periods for selected series (for deposit) using YRT_FACTORY
  const { data: depositPeriods, isLoading: isLoadingDepositPeriods } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'getPeriodsBySeriesId',
    args: depositSeriesId && /^\d+$/.test(depositSeriesId) ? [BigInt(depositSeriesId)] : undefined,
    query: {
      enabled: !!depositSeriesId && /^\d+$/.test(depositSeriesId),
    }
  }) as { data: [bigint[], PeriodInfo[]] | undefined, isLoading: boolean };


  // Get series ID from selected pool for distribute
  const selectedDistributePool = yrtSeries.find(pool => pool.poolAddress === distributeForm.poolAddress);
  const distributeSeriesId = selectedDistributePool?.seriesId?.toString() || (selectedDistributePool ? '1' : '');

  // Fetch periods for selected series (for distribute) using YRT_FACTORY
  const { data: distributePeriods, isLoading: isLoadingDistributePeriods } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'getPeriodsBySeriesId',
    args: distributeSeriesId && /^\d+$/.test(distributeSeriesId) ? [BigInt(distributeSeriesId)] : undefined,
    query: {
      enabled: !!distributeSeriesId && /^\d+$/.test(distributeSeriesId),
    }
  }) as { data: [bigint[], PeriodInfo[]] | undefined, isLoading: boolean };

  // Validate series and period existence
  const { data: seriesInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesInfo',
    args: depositSeriesId && /^\d+$/.test(depositSeriesId) ? [BigInt(depositSeriesId)] : undefined,
    query: {
      enabled: !!depositSeriesId && /^\d+$/.test(depositSeriesId),
    }
  });

  const { data: periodInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: depositSeriesId && depositForm.periodId && /^\d+$/.test(depositSeriesId) && /^\d+$/.test(depositForm.periodId)
      ? [BigInt(depositSeriesId), BigInt(depositForm.periodId)]
      : undefined,
    query: {
      enabled: !!depositSeriesId && !!depositForm.periodId && /^\d+$/.test(depositSeriesId) && /^\d+$/.test(depositForm.periodId),
    }
  });

  // Check allowance for deposit yield
  const { data: yieldTokenAllowance } = useTokenAllowance({
    tokenAddress: USDC_TOKEN,
    amount: depositForm.amount || '0',
    userAddress: address as `0x${string}`,
  });

  const needsYieldApproval = depositForm.amount && address
    ? checkNeedsApproval(yieldTokenAllowance as bigint, depositForm.amount)
    : false;

  const handleApproveYield = async () => {
    if (!address || !depositForm.amount) {
      toast.error('Missing approval parameters');
      return;
    }

    try {
      setIsApproving(true);
      toast.loading('Approving USDC...', { id: 'approve-yield' });

      await approveToken({
        tokenAddress: USDC_TOKEN,
        amount: depositForm.amount,
        userAddress: address,
      });

      toast.success('USDC approved successfully! Proceeding with deposit...', { id: 'approve-yield' });

      // Set auto-depositing state
      setIsAutoDepositing(true);

      // Wait for approval to be reflected on-chain
      setTimeout(async () => {
        // Refetch allowance to get updated value
        queryClient.invalidateQueries({
          queryKey: ['readContract']
        });

        // Wait longer to ensure the allowance is updated on-chain
        setTimeout(() => {
          handleDepositYield(new Event('auto-deposit') as any);
        }, 3000); // Increased from 500ms to 3 seconds
      }, 1000);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve USDC', {
        id: 'approve-yield'
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDepositYield = async (e: React.FormEvent) => {
    // Prevent default only if it's a form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Skip validation for auto-deposit (from approve)
    const isAutoDeposit = e && (e as any).type === 'auto-deposit';

    if (!isAutoDeposit && (!address || !depositForm.poolAddress || !depositForm.periodId || !depositForm.amount)) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Additional validation for amount
      const amountNum = parseFloat(depositForm.amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (amountNum > 1000000) {
        throw new Error('Amount seems too large. Please check your input.');
      }

      // Enhanced validation for poolAddress and periodId
      if (!depositForm.poolAddress || depositForm.poolAddress.trim() === '') {
        throw new Error('Please select a property first');
      }

      if (!depositForm.periodId || depositForm.periodId.trim() === '') {
        throw new Error('Please select a period from the dropdown');
      }

      // Get series ID from selected pool
      if (!selectedDepositPool || !selectedDepositPool.seriesId) {
        throw new Error('Selected property is not a valid YRT series');
      }

      // Enhanced validation for periodId (consistent with hook)
      const periodIdStr = depositForm.periodId.trim();

      if (periodIdStr === '') {
        throw new Error('Please select a period from the dropdown');
      }

      // Check if period ID is valid number
      if (!/^\d+$/.test(periodIdStr)) {
        throw new Error('Invalid period selection');
      }

      // Convert to BigInt with error handling (same as hook)
      let seriesIdNum, periodIdNum;
      try {
        seriesIdNum = selectedDepositPool.seriesId;
        periodIdNum = BigInt(periodIdStr);
      } catch (error) {
        throw new Error('Invalid selection. Please try selecting again.');
      }

      // Check for negative or zero values
      if (seriesIdNum <= BigInt(0) || periodIdNum <= BigInt(0)) {
        throw new Error('Invalid selection detected');
      }

      // Validate series exists
      if (!seriesInfo) {
        throw new Error(`Series ID ${seriesIdNum} does not exist. Please select a valid series.`);
      }

      // Validate period exists
      if (!periodInfo) {
        throw new Error(`Period ID ${periodIdNum} does not exist for Series ${seriesIdNum}. Please check the period number.`);
      }

      // Check if period is active
      if (periodInfo && typeof periodInfo === 'object' && periodInfo !== null && 'isActive' in periodInfo && !periodInfo.isActive) {
        console.warn(`Warning: Period ${periodIdNum} is not active. Proceeding anyway...`);
      }

      // Log debug info (consistent with hook)
      console.log('Deposit Yield Debug Info:', {
        poolAddress: depositForm.poolAddress,
        propertyName: selectedDepositPool.propertyName,
        seriesId: seriesIdNum.toString(),
        periodId: depositForm.periodId,
        periodIdNum: periodIdNum.toString(),
        amount: depositForm.amount,
        amountNum: amountNum,
        tokenAddress: USDC_TOKEN,
        seriesExists: !!seriesInfo,
        periodExists: !!periodInfo,
        periodActive: periodInfo && typeof periodInfo === 'object' && periodInfo !== null && 'isActive' in periodInfo ? periodInfo.isActive : undefined
      });

      // Additional safety check for timing
      if (isAutoDeposit) {
        // Small delay to ensure UI is updated
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Small delay for allowance processing
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.loading('Depositing yield...', { id: 'deposit-yield' });

      await depositYield({
        seriesId: seriesIdNum.toString(),
        periodId: depositForm.periodId,
        amount: depositForm.amount,
        tokenAddress: USDC_TOKEN
      });

      toast.success('Yield deposited successfully!', { id: 'deposit-yield' });
      setDepositForm({ poolAddress: '', periodId: '', amount: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deposit yield';

      // Check if it's an allowance error
      if (errorMessage.includes('allowance') || errorMessage.includes('approval') || errorMessage.includes('ERC20: transfer amount exceeds allowance')) {
        toast.error('Insufficient allowance detected', {
          id: 'deposit-yield',
          description: 'Please try approving the tokens again or wait a moment before retrying.',
        });
      } else if (errorMessage.includes('estimate') || errorMessage.includes('gas')) {
        toast.error('Network fee estimation failed', {
          id: 'deposit-yield',
          description: 'This could be due to invalid Series/Period ID or insufficient token allowance. Please check your inputs and try again.',
        });
      } else {
        toast.error(errorMessage, {
          id: 'deposit-yield'
        });
      }
    } finally {
      // Reset auto-depositing state
      if (isAutoDeposit) {
        setIsAutoDepositing(false);
      }
    }
  };

  
  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !distributeForm.poolAddress || !distributeForm.periodId) {
      toast.error('Please select both property and period');
      return;
    }

    // Get series ID from selected pool
    if (!selectedDistributePool || !selectedDistributePool.seriesId) {
      toast.error('Selected property is not a valid YRT series');
      return;
    }

    try {
      toast.loading('Distributing yield to all holders...', { id: 'distribute-yield' });

      await distributeToAllHolders({
        seriesId: selectedDistributePool.seriesId.toString(),
        periodId: distributeForm.periodId
      });

      toast.success('Yield distributed successfully!', { id: 'distribute-yield' });
      setDistributeForm({ poolAddress: '', periodId: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to distribute yield', {
        id: 'distribute-yield'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Selector */}
      <div className="flex items-center space-x-2 bg-[#1A1A1A]/40 backdrop-blur-sm border border-[#2A2A2A]/50 rounded-xl p-2">
        <Button
          onClick={() => setActiveAction('deposit')}
          variant={activeAction === 'deposit' ? 'default' : 'ghost'}
          className={activeAction === 'deposit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'}
        >
          <Gift className="w-4 h-4 mr-2" />
          Deposit Yield
        </Button>
        <Button
          onClick={() => setActiveAction('distribute')}
          variant={activeAction === 'distribute' ? 'default' : 'ghost'}
          className={activeAction === 'distribute' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'}
        >
          <Send className="w-4 h-4 mr-2" />
          Distribute
        </Button>
      </div>

      {/* Deposit Yield */}
      {activeAction === 'deposit' && (
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Gift className="w-6 h-6 text-blue-400" />
              <div>
                <CardTitle className="text-white">Deposit Yield</CardTitle>
                <CardDescription className="text-gray-400">
                  Deposit yield to an active period for distribution to token holders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDepositYield} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Property</Label>
                  <Select
                    value={depositForm.poolAddress}
                    onValueChange={(value) => setDepositForm(prev => ({ ...prev, poolAddress: value }))}
                    disabled={isDepositPending}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder="Select property..." />
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
                                  {pool.isYRTPool && pool.seriesId ? `Series #${pool.seriesId.toString()} • ` : ''}{pool.token0Symbol}/{pool.token1Symbol}
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
                  <Label className="text-gray-300">Period</Label>
                  <Select
                    value={depositForm.periodId}
                    onValueChange={(value) => setDepositForm(prev => ({ ...prev, periodId: value }))}
                    disabled={isDepositPending || isAutoDepositing || !depositForm.poolAddress || isLoadingDepositPeriods}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder={isLoadingDepositPeriods ? "Loading periods..." : "Select period..."}>
                        {depositForm.periodId ? `Period ${depositForm.periodId}` : (isLoadingDepositPeriods ? "Loading periods..." : "Select period...")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] max-h-60 w-full">
                      {isLoadingDepositPeriods ? (
                        <div className="p-4 text-center text-gray-400">
                          Loading periods...
                        </div>
                      ) : depositPeriods && depositPeriods[0] && depositPeriods[0].length > 0 ? (
                        depositPeriods[0].map((periodId: bigint, index: number) => {
                          const periodInfo = depositPeriods[1]?.[index];
                          if (!periodInfo) return null;

                          // Get period status for subtle indication
                          const isActive = periodInfo.isActive;

                          return (
                            <SelectItem
                              key={periodId.toString()}
                              value={periodId.toString()}
                              className="text-white hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] data-[highlighted]:bg-[#3A3A3A] py-3 px-4 cursor-pointer"
                            >
                              <div className="flex items-center justify-between w-full gap-4">
                                <span className="font-medium">Period {periodId.toString()}</span>
                                <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                                  isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          {depositForm.poolAddress ? 'No active periods found' : 'Select a property first'}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Only periods with yield deposits are shown. Select the period you want to deposit yield to.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Amount (USDC)</Label>
                  <Input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="1000"
                    min="0.01"
                    step="0.01"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isDepositPending}
                  />
                </div>
              </div>

              {/* Approval/Deposit Button */}
              {needsYieldApproval ? (
                <Button
                  type="button"
                  onClick={handleApproveYield}
                  disabled={isApproving || isAutoDepositing || !depositForm.amount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isAutoDepositing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Approving & Auto-Depositing...
                    </>
                  ) : isApproving ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Approving USDC...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Approve USDC
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isDepositPending || isAutoDepositing || !depositForm.poolAddress || !depositForm.periodId || !depositForm.amount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAutoDepositing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Auto-Depositing...
                    </>
                  ) : isDepositPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Depositing...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Deposit Yield
                    </>
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Distribute Yield */}
      {activeAction === 'distribute' && (
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Send className="w-6 h-6 text-green-400" />
              <div>
                <CardTitle className="text-white">Distribute Yield</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribute yield to all snapshot holders automatically
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDistribute} className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-blue-400 mb-1">Automatic Distribution</p>
                    <p className="text-gray-400">
                      This will automatically distribute yield to all holders based on their snapshot balances.
                      The process is handled by AutoDistributor contract.
                    </p>
                  </div>
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Property</Label>
                  <Select
                    value={distributeForm.poolAddress}
                    onValueChange={(value) => setDistributeForm(prev => ({ ...prev, poolAddress: value }))}
                    disabled={isDistributePending}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder="Select property..." />
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
                                  {pool.isYRTPool && pool.seriesId ? `Series #${pool.seriesId.toString()} • ` : ''}{pool.token0Symbol}/{pool.token1Symbol}
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
                  <Label className="text-gray-300">Period</Label>
                  <Select
                    value={distributeForm.periodId}
                    onValueChange={(value) => setDistributeForm(prev => ({ ...prev, periodId: value }))}
                    disabled={isDistributePending || !distributeForm.poolAddress || isLoadingDistributePeriods}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder={isLoadingDistributePeriods ? "Loading periods..." : "Select period..."}>
                        {distributeForm.periodId ? `Period ${distributeForm.periodId}` : (isLoadingDistributePeriods ? "Loading periods..." : "Select period...")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] max-h-60 w-full">
                      {isLoadingDistributePeriods ? (
                        <div className="p-4 text-center text-gray-400">
                          Loading periods...
                        </div>
                      ) : distributePeriods && distributePeriods[0] && distributePeriods[0].length > 0 ? (
                        distributePeriods[0]
                          .map((periodId: bigint, index: number) => {
                            const periodInfo = distributePeriods[1]?.[index];
                            if (!periodInfo) return null;
                            
                            // For distribute, only show matured periods with yield
                            const isMatured = Date.now() >= Number(periodInfo.maturityDate) * 1000;
                            const hasYield = Number(periodInfo.totalYield || 0) > 0;
                            const isActive = periodInfo.isActive;
                            
                            if (!isMatured || !hasYield) return null;

                            return (
                              <SelectItem
                                key={periodId.toString()}
                                value={periodId.toString()}
                                className="text-white hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] data-[highlighted]:bg-[#3A3A3A] py-3 px-4 cursor-pointer"
                              >
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span className="font-medium">Period {periodId.toString()}</span>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                      Ready
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })
                          .filter(Boolean)
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          {distributeForm.poolAddress ?
                            'No periods ready for distribution'
                            : 'Select a property first'
                          }
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Only matured periods with yield are shown. These are ready for distribution to holders.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isDistributePending || !distributeForm.poolAddress || !distributeForm.periodId}
                className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDistributePending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Distributing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Distribute to All Holders
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
