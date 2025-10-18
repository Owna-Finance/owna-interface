'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useDepositYield, useDistributeToAllHolders, useUserOwnedSeries, useDistributionValidation } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Gift, Send, AlertCircle } from 'lucide-react';

export function YieldDistributionTab() {
  const { address } = useAccount();
  const {
    depositYield,
    isPending: isDepositPending,
    approveToken,
    useTokenAllowance,
    checkNeedsApproval
  } = useDepositYield();
  const { distributeToAllHolders, isLoading: isDistributePending } = useDistributeToAllHolders();

  // Fetch only series owned by connected wallet
  const { ownedSeries, isLoading: isLoadingSeries } = useUserOwnedSeries();

  const [activeAction, setActiveAction] = useState<'deposit' | 'distribute'>('deposit');
  const [isApproving, setIsApproving] = useState(false);

  const [depositForm, setDepositForm] = useState({
    seriesId: '',
    periodId: '',
    amount: ''
  });

  const [distributeForm, setDistributeForm] = useState({
    seriesId: '',
    periodId: ''
  });

  // Validate distribution prerequisites
  const distributionValidation = useDistributionValidation(
    distributeForm.seriesId,
    distributeForm.periodId
  );

  // USDC token address for yield deposits
  const USDC_TOKEN = '0x7377f4b7176369366d6d484074898447896085c5' as `0x${string}`;

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

      toast.success('USDC approved successfully!', { id: 'approve-yield' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to approve USDC', {
        id: 'approve-yield'
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDepositYield = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !depositForm.seriesId || !depositForm.periodId || !depositForm.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
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
      toast.error(error instanceof Error ? error.message : 'Failed to deposit yield', {
        id: 'deposit-yield'
      });
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
                    disabled={isDepositPending || isLoadingSeries || ownedSeries.length === 0}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder={
                        isLoadingSeries
                          ? "Loading..."
                          : ownedSeries.length === 0
                            ? "No properties owned"
                            : "Select property..."
                      } />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                      {ownedSeries.map((series) => (
                        <SelectItem
                          key={series.seriesId.toString()}
                          value={series.seriesId.toString()}
                          className="text-white hover:bg-[#3A3A3A]"
                        >
                          {series.propertyName} (Series #{series.seriesId.toString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Period ID</Label>
                  <Input
                    type="number"
                    value={depositForm.periodId}
                    onChange={(e) => setDepositForm(prev => ({ ...prev, periodId: e.target.value }))}
                    placeholder="1"
                    min="1"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isDepositPending}
                  />
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
                  disabled={isApproving || !depositForm.amount}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isApproving ? (
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
                  disabled={isDepositPending || !depositForm.seriesId || !depositForm.periodId || !depositForm.amount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isDepositPending ? (
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

              {/* Distribution Validation Status */}
              {distributeForm.seriesId && distributeForm.periodId && (
                <div className={`rounded-lg p-4 mb-6 ${
                  distributionValidation.canDistribute
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-yellow-500/10 border border-yellow-500/20'
                }`}>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${distributionValidation.isPeriodActive ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-gray-300">
                        Period {distributionValidation.isPeriodActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${distributionValidation.isPeriodMatured ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <span className="text-gray-300">
                        Period {distributionValidation.isPeriodMatured ? 'Matured' : 'Not Matured Yet'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${distributionValidation.isSnapshotTaken ? 'bg-green-400' : 'bg-yellow-400'}`} />
                      <span className="text-gray-300">
                        Snapshot {distributionValidation.isSnapshotTaken ? 'Taken (Chainlink)' : 'Pending (Automatic via Chainlink)'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${distributionValidation.hasYield ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-gray-300">
                        Yield {distributionValidation.hasYield ? 'Deposited' : 'Not Deposited'}
                      </span>
                    </div>
                    {distributionValidation.errorMessage && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <p className="text-yellow-400 font-medium">
                          ⚠️ {distributionValidation.errorMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Property</Label>
                  <Select
                    value={distributeForm.seriesId}
                    onValueChange={(value) => setDistributeForm(prev => ({ ...prev, seriesId: value }))}
                    disabled={isDistributePending || isLoadingSeries || ownedSeries.length === 0}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder={
                        isLoadingSeries
                          ? "Loading..."
                          : ownedSeries.length === 0
                            ? "No properties owned"
                            : "Select property..."
                      } />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                      {ownedSeries.map((series) => (
                        <SelectItem
                          key={series.seriesId.toString()}
                          value={series.seriesId.toString()}
                          className="text-white hover:bg-[#3A3A3A]"
                        >
                          {series.propertyName} (Series #{series.seriesId.toString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Period ID</Label>
                  <Input
                    type="number"
                    value={distributeForm.periodId}
                    onChange={(e) => setDistributeForm(prev => ({ ...prev, periodId: e.target.value }))}
                    placeholder="1"
                    min="1"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isDistributePending}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={
                  isDistributePending ||
                  !distributeForm.seriesId ||
                  !distributeForm.periodId ||
                  !distributionValidation.canDistribute
                }
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
                    {distributionValidation.canDistribute
                      ? 'Distribute to All Holders'
                      : (distributionValidation.errorMessage || 'Cannot Distribute')}
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
