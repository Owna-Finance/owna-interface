'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { useDepositYield, useDistributeToAllHolders, useUserPools } from '@/hooks';
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

  // Extract YRT series from pools
  const yrtSeries = useMemo(() => {
    if (!pools) return [];
    return pools.filter(pool => pool.isYRTPool);
  }, [pools]);

  const isLoadingSeries = isLoadingPools;
  const seriesError = poolsError;

  const [activeAction, setActiveAction] = useState<'deposit' | 'distribute'>('deposit');
  const [isApproving, setIsApproving] = useState(false);
  const [isAutoDepositing, setIsAutoDepositing] = useState(false);

  const [depositForm, setDepositForm] = useState({
    seriesId: '',
    periodId: '',
    amount: ''
  });

  const [distributeForm, setDistributeForm] = useState({
    seriesId: '',
    periodId: ''
  });

  
  // USDC token address for yield deposits
  const USDC_TOKEN = CONTRACTS.USDC;

  // Validate series and period existence
  const { data: seriesInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'seriesInfo',
    args: depositForm.seriesId && /^\d+$/.test(depositForm.seriesId) ? [BigInt(depositForm.seriesId)] : undefined,
    query: {
      enabled: !!depositForm.seriesId && /^\d+$/.test(depositForm.seriesId),
    }
  });

  const { data: periodInfo } = useReadContract({
    address: CONTRACTS.YRT_FACTORY,
    abi: YRT_FACTORY_ABI,
    functionName: 'periodInfo',
    args: depositForm.seriesId && depositForm.periodId && /^\d+$/.test(depositForm.seriesId) && /^\d+$/.test(depositForm.periodId)
      ? [BigInt(depositForm.seriesId), BigInt(depositForm.periodId)]
      : undefined,
    query: {
      enabled: !!depositForm.seriesId && !!depositForm.periodId && /^\d+$/.test(depositForm.seriesId) && /^\d+$/.test(depositForm.periodId),
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

    if (!isAutoDeposit && (!address || !depositForm.seriesId || !depositForm.periodId || !depositForm.amount)) {
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

      // Enhanced validation for seriesId and periodId
      if (!depositForm.seriesId || depositForm.seriesId.trim() === '') {
        throw new Error('Series ID is required');
      }

      if (!depositForm.periodId || depositForm.periodId.trim() === '') {
        throw new Error('Period ID is required');
      }

      // Enhanced validation for seriesId and periodId (consistent with hook)
      const seriesIdStr = depositForm.seriesId.trim();
      const periodIdStr = depositForm.periodId.trim();

      if (seriesIdStr === '') {
        throw new Error('Series ID is required');
      }

      if (periodIdStr === '') {
        throw new Error('Period ID is required');
      }

      // Check if inputs are valid numbers
      if (!/^\d+$/.test(seriesIdStr)) {
        throw new Error('Series ID must be a valid number');
      }

      if (!/^\d+$/.test(periodIdStr)) {
        throw new Error('Period ID must be a valid number');
      }

      // Convert to BigInt with error handling (same as hook)
      let seriesIdNum, periodIdNum;
      try {
        seriesIdNum = BigInt(seriesIdStr);
        periodIdNum = BigInt(periodIdStr);
      } catch (error) {
        throw new Error('Invalid Series ID or Period ID format. Must be valid numbers.');
      }

      // Check for negative or zero values
      if (seriesIdNum <= 0n || periodIdNum <= 0n) {
        throw new Error('Series ID and Period ID must be greater than 0');
      }

      // Check for unreasonably large values
      if (seriesIdNum > 1000000n || periodIdNum > 1000000n) {
        throw new Error('Series ID or Period ID seems too large. Please check your input.');
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
      if (periodInfo && !periodInfo.isActive) {
        console.warn(`Warning: Period ${periodIdNum} is not active. Proceeding anyway...`);
      }

      // Log debug info (consistent with hook)
      console.log('Deposit Yield Debug Info:', {
        seriesId: depositForm.seriesId,
        seriesIdNum: seriesIdNum.toString(),
        periodId: depositForm.periodId,
        periodIdNum: periodIdNum.toString(),
        amount: depositForm.amount,
        amountNum: amountNum,
        tokenAddress: USDC_TOKEN,
        seriesExists: !!seriesInfo,
        periodExists: !!periodInfo,
        periodActive: periodInfo?.isActive
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
        seriesId: depositForm.seriesId,
        periodId: depositForm.periodId,
        amount: depositForm.amount,
        tokenAddress: USDC_TOKEN
      });

      toast.success('Yield deposited successfully!', { id: 'deposit-yield' });
      setDepositForm({ seriesId: '', periodId: '', amount: '' });
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

    if (!address || !distributeForm.seriesId || !distributeForm.periodId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      toast.loading('Distributing yield to all holders...', { id: 'distribute-yield' });

      await distributeToAllHolders({
        seriesId: distributeForm.seriesId,
        periodId: distributeForm.periodId
      });

      toast.success('Yield distributed successfully!', { id: 'distribute-yield' });
      setDistributeForm({ seriesId: '', periodId: '' });
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
                    value={depositForm.seriesId}
                    onValueChange={(value) => setDepositForm(prev => ({ ...prev, seriesId: value }))}
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
                            value={pool.seriesId?.toString() || ''}
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
                              <span>{pool.propertyName} (Series #{pool.seriesId?.toString() || 'N/A'})</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Period ID</Label>
                  <Input
                    type="number"
                    value={depositForm.periodId}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, periodId: e.target.value }))}
                    placeholder="Enter period number (e.g., 1, 2, 3)"
                    min="1"
                    max="100"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isDepositPending || isAutoDepositing}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the fundraising period number. Usually starts from 1.
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
                  disabled={isDepositPending || isAutoDepositing || !depositForm.seriesId || !depositForm.periodId || !depositForm.amount}
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
                    value={distributeForm.seriesId}
                    onValueChange={(value) => setDistributeForm(prev => ({ ...prev, seriesId: value }))}
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
                            value={pool.seriesId?.toString() || ''}
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
                              <span>{pool.propertyName} (Series #{pool.seriesId?.toString() || 'N/A'})</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Period ID</Label>
                  <Input
                    type="number"
                    value={distributeForm.periodId}
                    onChange={(e) => setDistributeForm(prev => ({ ...prev, periodId: e.target.value }))}
                    placeholder="Enter period number (e.g., 1, 2, 3)"
                    min="1"
                    max="100"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isDistributePending}
                  />
                  <p className="text-xs text-gray-500">
                    Enter the fundraising period number to distribute yield for.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isDistributePending || !distributeForm.seriesId || !distributeForm.periodId}
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
