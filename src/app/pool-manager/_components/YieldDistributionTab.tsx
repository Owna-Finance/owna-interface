'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useDepositYield, useTriggerSnapshot, useDistributeToAllHolders, useYRTSeries } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Gift, Camera, Send, AlertCircle } from 'lucide-react';

export function YieldDistributionTab() {
  const { address } = useAccount();
  const { depositYield, isPending: isDepositPending } = useDepositYield();
  const { triggerSnapshot, isPending: isSnapshotPending } = useTriggerSnapshot();
  const { distributeToAllHolders, isLoading: isDistributePending } = useDistributeToAllHolders();
  const { allSeriesIds, isLoadingIds, useSeriesInfo, useSeriesSlug } = useYRTSeries();

  const [activeAction, setActiveAction] = useState<'deposit' | 'snapshot' | 'distribute'>('deposit');

  const [depositForm, setDepositForm] = useState({
    seriesId: '',
    periodId: '',
    amount: ''
  });

  const [snapshotForm, setSnapshotForm] = useState({
    seriesId: '',
    periodId: ''
  });

  const [distributeForm, setDistributeForm] = useState({
    seriesId: '',
    periodId: ''
  });

  const [seriesList, setSeriesList] = useState<any[]>([]);

  useEffect(() => {
    if (allSeriesIds && !isLoadingIds) {
      loadAllSeries();
    }
  }, [allSeriesIds, isLoadingIds]);

  const loadAllSeries = async () => {
    if (!allSeriesIds || !Array.isArray(allSeriesIds)) return;

    const series = [];
    for (const seriesId of allSeriesIds) {
      const infoHook = useSeriesInfo(seriesId);
      const slugHook = useSeriesSlug(seriesId);

      if (infoHook.data && slugHook.data) {
        series.push({
          id: seriesId,
          info: infoHook.data,
          slug: slugHook.data,
        });
      }
    }
    setSeriesList(series);
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
        tokenAddress: '0x7377f4b7176369366d6d484074898447896085c5' as `0x${string}`
      });

      toast.success('Yield deposited successfully!', { id: 'deposit-yield' });
      setDepositForm({ seriesId: '', periodId: '', amount: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to deposit yield', {
        id: 'deposit-yield'
      });
    }
  };

  const handleTriggerSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !snapshotForm.seriesId || !snapshotForm.periodId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      toast.loading('Taking snapshot...', { id: 'trigger-snapshot' });

      await triggerSnapshot(BigInt(snapshotForm.seriesId), BigInt(snapshotForm.periodId));

      toast.success('Snapshot taken successfully!', { id: 'trigger-snapshot' });
      setSnapshotForm({ seriesId: '', periodId: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to take snapshot', {
        id: 'trigger-snapshot'
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
          onClick={() => setActiveAction('snapshot')}
          variant={activeAction === 'snapshot' ? 'default' : 'ghost'}
          className={activeAction === 'snapshot' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'}
        >
          <Camera className="w-4 h-4 mr-2" />
          Take Snapshot
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
                      {seriesList.map((series) => (
                        <SelectItem
                          key={series.id.toString()}
                          value={series.id.toString()}
                          className="text-white hover:bg-[#3A3A3A]"
                        >
                          {series.slug} - {series.info.propertyName}
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
            </form>
          </CardContent>
        </Card>
      )}

      {/* Trigger Snapshot */}
      {activeAction === 'snapshot' && (
        <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6 text-purple-400" />
              <div>
                <CardTitle className="text-white">Take Snapshot</CardTitle>
                <CardDescription className="text-gray-400">
                  Record holder balances at period maturity for yield distribution
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTriggerSnapshot} className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-yellow-400 mb-1">Important</p>
                    <p className="text-gray-400">
                      Snapshot can only be taken after period maturity date. This records all holder balances
                      atomically for fair yield distribution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Property</Label>
                  <Select
                    value={snapshotForm.seriesId}
                    onValueChange={(value) => setSnapshotForm(prev => ({ ...prev, seriesId: value }))}
                    disabled={isSnapshotPending}
                  >
                    <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                      <SelectValue placeholder="Select property..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                      {seriesList.map((series) => (
                        <SelectItem
                          key={series.id.toString()}
                          value={series.id.toString()}
                          className="text-white hover:bg-[#3A3A3A]"
                        >
                          {series.slug} - {series.info.propertyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Period ID</Label>
                  <Input
                    type="number"
                    value={snapshotForm.periodId}
                    onChange={(e) => setSnapshotForm(prev => ({ ...prev, periodId: e.target.value }))}
                    placeholder="1"
                    min="1"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isSnapshotPending}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSnapshotPending || !snapshotForm.seriesId || !snapshotForm.periodId}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSnapshotPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Taking Snapshot...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Take Snapshot
                  </>
                )}
              </Button>
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
                      {seriesList.map((series) => (
                        <SelectItem
                          key={series.id.toString()}
                          value={series.id.toString()}
                          className="text-white hover:bg-[#3A3A3A]"
                        >
                          {series.slug} - {series.info.propertyName}
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
                disabled={isDistributePending || !distributeForm.seriesId || !distributeForm.periodId}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
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
