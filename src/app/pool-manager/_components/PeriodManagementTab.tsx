'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useStartNewPeriod } from '@/hooks/useStartNewPeriod';
import { useUserOwnedSeries } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export function PeriodManagementTab() {
  const { address } = useAccount();
  const { startNewPeriod, isPending, isSuccess } = useStartNewPeriod();

  // Fetch only series owned by connected wallet
  const { ownedSeries, isLoading: isLoadingSeries, error: seriesError } = useUserOwnedSeries();

  const [formData, setFormData] = useState({
    seriesId: '',
    durationDays: '30'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!formData.seriesId || !formData.durationDays) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      toast.loading('Starting new period...', { id: 'start-period' });

      const durationSeconds = parseInt(formData.durationDays) * 24 * 60 * 60;

      await startNewPeriod({
        seriesId: formData.seriesId,
        durationInSeconds: durationSeconds
      });

      toast.success('New period started successfully!', { id: 'start-period' });

      setFormData({ seriesId: '', durationDays: '30' });
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
                  value={formData.seriesId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, seriesId: value }))}
                  disabled={isPending || isLoadingSeries || ownedSeries.length === 0}
                >
                  <SelectTrigger className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white">
                    <SelectValue placeholder={
                      isLoadingSeries
                        ? "Loading your properties..."
                        : ownedSeries.length === 0
                          ? "No properties owned"
                          : "Choose a property..."
                    } />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    {ownedSeries.map((series) => (
                      <SelectItem
                        key={series.seriesId.toString()}
                        value={series.seriesId.toString()}
                        className="text-white hover:bg-[#3A3A3A]"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{series.propertyName}</span>
                          <span className="text-xs text-gray-400">Series #{series.seriesId.toString()}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isLoadingSeries && ownedSeries.length === 0 && (
                  <p className="text-xs text-red-400">
                    You don't own any properties. Create a property first in the Add Property page.
                  </p>
                )}
                {seriesError && (
                  <p className="text-xs text-red-400">Error loading properties: {seriesError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationDays" className="text-gray-300">
                  Fundraising Duration (Days)
                </Label>
                <Input
                  id="durationDays"
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: e.target.value }))}
                  placeholder="30"
                  min="1"
                  max="365"
                  className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white placeholder-gray-500"
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500">
                  Recommended: 30 days for fundraising periods
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
              disabled={isPending || !address || !formData.seriesId}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Starting Period...
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
