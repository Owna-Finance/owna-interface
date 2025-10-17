'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Settings, ArrowDownToLine, ArrowUpFromLine, DollarSign, Info } from 'lucide-react';

export function PropertySettingsTab() {
  const { address } = useAccount();

  const [injectForm, setInjectForm] = useState({
    poolAddress: '',
    amount: ''
  });

  const [withdrawForm, setWithdrawForm] = useState({
    poolAddress: '',
    amount: '',
    recipient: ''
  });

  const [isInjecting, setIsInjecting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !injectForm.poolAddress || !injectForm.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsInjecting(true);
      toast.loading('Injecting stablecoin...', { id: 'inject-stable' });

      // TODO: Implement ownerInjectStable contract call

      toast.success('Stablecoin injected successfully!', { id: 'inject-stable' });
      setInjectForm({ poolAddress: '', amount: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to inject stablecoin', {
        id: 'inject-stable'
      });
    } finally {
      setIsInjecting(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !withdrawForm.poolAddress || !withdrawForm.amount || !withdrawForm.recipient) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsWithdrawing(true);
      toast.loading('Withdrawing stablecoin...', { id: 'withdraw-stable' });

      // TODO: Implement ownerWithdrawStable contract call

      toast.success('Stablecoin withdrawn successfully!', { id: 'withdraw-stable' });
      setWithdrawForm({ poolAddress: '', amount: '', recipient: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to withdraw stablecoin', {
        id: 'withdraw-stable'
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Inject Stablecoin */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ArrowUpFromLine className="w-6 h-6 text-green-400" />
            <div>
              <CardTitle className="text-white">Inject Stablecoin</CardTitle>
              <CardDescription className="text-gray-400">
                Add stablecoin to pool reserves to increase YRT token price
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInject} className="space-y-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-green-400 mb-1">Price Mechanism</p>
                  <p className="text-gray-400">
                    Injecting stablecoin increases token1 (USDC/IDRX) reserves, which automatically
                    raises the price of token0 (YRT) following the constant product formula (x * y = k).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Pool Address</Label>
                <Input
                  value={injectForm.poolAddress}
                  onChange={(e) => setInjectForm(prev => ({ ...prev, poolAddress: e.target.value }))}
                  placeholder="0x..."
                  className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white font-mono"
                  disabled={isInjecting}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Amount (USDC/IDRX)</Label>
                <Input
                  type="number"
                  value={injectForm.amount}
                  onChange={(e) => setInjectForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="1000"
                  min="0.01"
                  step="0.01"
                  className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                  disabled={isInjecting}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isInjecting || !injectForm.poolAddress || !injectForm.amount}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isInjecting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Injecting...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Inject Stablecoin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdraw Stablecoin */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ArrowDownToLine className="w-6 h-6 text-orange-400" />
            <div>
              <CardTitle className="text-white">Withdraw Stablecoin</CardTitle>
              <CardDescription className="text-gray-400">
                Withdraw stablecoin from pool reserves for operational needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-orange-400 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-orange-400 mb-1">Property Owner Only</p>
                  <p className="text-gray-400">
                    Only the property owner can withdraw stablecoin. This reduces pool reserves and may
                    affect the YRT token price.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Pool Address</Label>
                <Input
                  value={withdrawForm.poolAddress}
                  onChange={(e) => setWithdrawForm(prev => ({ ...prev, poolAddress: e.target.value }))}
                  placeholder="0x..."
                  className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white font-mono"
                  disabled={isWithdrawing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Amount (USDC/IDRX)</Label>
                  <Input
                    type="number"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="1000"
                    min="0.01"
                    step="0.01"
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white"
                    disabled={isWithdrawing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Recipient Address</Label>
                  <Input
                    value={withdrawForm.recipient}
                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder="0x..."
                    className="bg-[#2A2A2A]/50 border-[#3A3A3A] text-white font-mono"
                    disabled={isWithdrawing}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isWithdrawing || !withdrawForm.poolAddress || !withdrawForm.amount || !withdrawForm.recipient}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isWithdrawing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Withdrawing...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Withdraw Stablecoin
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Price Management Guide */}
      <Card className="bg-[#1A1A1A]/40 backdrop-blur-sm border-[#2A2A2A]/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <DollarSign className="w-6 h-6 text-blue-400" />
            <div>
              <CardTitle className="text-white">Price Management Guide</CardTitle>
              <CardDescription className="text-gray-400">
                Understanding pool reserve management
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowUpFromLine className="w-3 h-3 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Inject Stablecoin → Price Increases</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Adding stablecoin to pool increases token1 reserve, making YRT (token0) more valuable.
                  Formula: price = reserve1 / reserve0
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ArrowDownToLine className="w-3 h-3 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Withdraw Stablecoin → Price Decreases</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Withdrawing stablecoin decreases token1 reserve, making YRT (token0) less valuable.
                  Use for operational needs only.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#3A3A3A]">
              <p className="text-xs text-gray-500">
                Example: If pool has 100,000 YRT and 50,000 USDC, price = 0.5 USDC per YRT.
                Injecting 10,000 USDC → new price = 0.6 USDC per YRT (+20%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
