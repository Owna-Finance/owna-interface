'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useYRTSeries } from '@/hooks/useYRTSeries';
import { useDEX } from '@/hooks/useDEX';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { formatUnits } from 'viem';
import { Loader2, Plus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PoolFormData {
  yrtSlug: string;
  yrtAddress: string;
  underlyingToken: string;
  amountYRT: string;
  amountUnderlying: string;
  propertyName: string;
  slippage: string;
  deadline: string;
}

export default function CreatePoolPage() {
  const { address, isConnected } = useAccount();
  const {
    useSeriesInfoWithSlug,
    useSeriesIdBySlug,
    slugToSeriesId,
    isValidSlug,
    extractSymbolFromSlug
  } = useYRTSeries();
  const { addLiquidity, useGetPool, hash, isPending, isConfirming, isSuccess } = useDEX();

  const [formData, setFormData] = useState<PoolFormData>({
    yrtSlug: '',
    yrtAddress: '',
    underlyingToken: '',
    amountYRT: '',
    amountUnderlying: '',
    propertyName: '',
    slippage: '1',
    deadline: '20',
  });

  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'approving' | 'creating' | 'success'>('form');
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [poolExists, setPoolExists] = useState(false);

  // Available underlying tokens
  const underlyingTokens = [
    { value: CONTRACTS.USDC, label: 'USDC', symbol: 'USDC' },
    { value: CONTRACTS.IDRX, label: 'IDRX', symbol: 'IDRX' },
  ];

  // Handle slug input change
  const handleSlugChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setFormData(prev => ({ ...prev, yrtSlug: upperValue }));

    if (isValidSlug(upperValue)) {
      const seriesId = slugToSeriesId(upperValue);
      if (seriesId > 0) {
        const { data: seriesInfo } = useSeriesInfoWithSlug(seriesId);
        if (seriesInfo) {
          setSelectedSeries(seriesInfo);
          setFormData(prev => ({
            ...prev,
            yrtAddress: (seriesInfo as any).tokenAddress || '',
            propertyName: (seriesInfo as any).propertyName || '',
          }));
        }
      }
    }
  };

  // Handle underlying token change
  const handleUnderlyingTokenChange = (value: string) => {
    setFormData(prev => ({ ...prev, underlyingToken: value }));
  };

  // Check if pool exists
  useEffect(() => {
    if (formData.yrtAddress && formData.underlyingToken) {
      const { data: poolAddress } = useGetPool(formData.yrtAddress as `0x${string}`, formData.underlyingToken as `0x${string}`);
      setPoolExists(!!poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000');
    }
  }, [formData.yrtAddress, formData.underlyingToken, useGetPool]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to create a pool',
      });
      return;
    }

    if (!formData.yrtSlug || !formData.underlyingToken || !formData.amountYRT || !formData.amountUnderlying) {
      toast.error('Form incomplete', {
        description: 'Please fill in all required fields',
      });
      return;
    }

    if (!isValidSlug(formData.yrtSlug)) {
      toast.error('Invalid slug format', {
        description: 'Please use format: SYMBOL-XX (e.g., OWF-01)',
      });
      return;
    }

    if (poolExists) {
      toast.error('Pool already exists', {
        description: 'A pool for this token pair already exists',
      });
      return;
    }

    try {
      setIsCreatingPool(true);
      setCurrentStep('creating');

      const deadline = Math.floor(Date.now() / 1000) + (parseInt(formData.deadline) * 60);

      await addLiquidity({
        tokenA: formData.yrtAddress as `0x${string}`,
        tokenB: formData.underlyingToken as `0x${string}`,
        amountADesired: formData.amountYRT,
        amountBDesired: formData.amountUnderlying,
        amountAMin: (parseFloat(formData.amountYRT) * (1 - parseFloat(formData.slippage) / 100)).toString(),
        amountBMin: (parseFloat(formData.amountUnderlying) * (1 - parseFloat(formData.slippage) / 100)).toString(),
        to: address as `0x${string}`,
        deadline,
        propertyName: formData.propertyName,
        propertyOwner: address as `0x${string}`,
      });

      setCurrentStep('success');
      toast.success('Pool created successfully!', {
        description: 'Your liquidity pool has been created and funded',
      });

    } catch (error) {
      setCurrentStep('form');
      toast.error('Failed to create pool', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsCreatingPool(false);
    }
  };

  if (!isConnected) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400">Please connect your wallet to create a pool</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create Liquidity Pool</h1>
          <p className="text-gray-400">
            Create a new liquidity pool for YRT token trading
          </p>
        </div>

        {/* Current Status */}
        {currentStep !== 'form' && (
          <div className="mb-6">
            {currentStep === 'creating' && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Creating pool... Please confirm the transaction in your wallet.
                </AlertDescription>
              </Alert>
            )}
            {currentStep === 'success' && (
              <Alert className="border-green-500/30 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  Pool created successfully! Your liquidity has been added.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Pool Creation Form */}
        <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Pool Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* YRT Token Selection */}
              <div className="space-y-2">
                <Label htmlFor="yrtSlug" className="text-gray-300">
                  YRT Token Slug
                </Label>
                <Input
                  id="yrtSlug"
                  type="text"
                  placeholder="e.g., OWF-01"
                  value={formData.yrtSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500"
                  disabled={isCreatingPool}
                />
                <p className="text-xs text-gray-500">
                  Enter the YRT token slug (format: SYMBOL-XX)
                </p>
                {formData.yrtSlug && !isValidSlug(formData.yrtSlug) && (
                  <p className="text-xs text-red-400">
                    Invalid slug format. Use format: SYMBOL-XX (e.g., OWF-01)
                  </p>
                )}
              </div>

              {/* Selected YRT Info */}
              {selectedSeries && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">Selected YRT Token</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-500">Property:</span> {(selectedSeries as any).propertyName}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Token Address:</span> {(selectedSeries as any).tokenAddress?.slice(0, 8)}...{(selectedSeries as any).tokenAddress?.slice(-6)}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Slug:</span> {formData.yrtSlug}
                    </p>
                  </div>
                </div>
              )}

              {/* Underlying Token Selection */}
              <div className="space-y-2">
                <Label htmlFor="underlyingToken" className="text-gray-300">
                  Underlying Token
                </Label>
                <Select
                  value={formData.underlyingToken}
                  onValueChange={handleUnderlyingTokenChange}
                  disabled={isCreatingPool}
                >
                  <SelectTrigger className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
                    <SelectValue placeholder="Select underlying token" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A]">
                    {underlyingTokens.map((token) => (
                      <SelectItem key={token.value} value={token.value} className="text-white">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{token.symbol}</span>
                          <span className="text-gray-500">{token.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pool Exists Warning */}
              {poolExists && (
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    A pool for this token pair already exists. You can add liquidity to the existing pool instead.
                  </AlertDescription>
                </Alert>
              )}

              {/* Liquidity Amounts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amountYRT" className="text-gray-300">
                    YRT Token Amount
                  </Label>
                  <Input
                    id="amountYRT"
                    type="number"
                    placeholder="0.0"
                    value={formData.amountYRT}
                    onChange={(e) => setFormData(prev => ({ ...prev, amountYRT: e.target.value }))}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500"
                    disabled={isCreatingPool}
                    step="0.000001"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amountUnderlying" className="text-gray-300">
                    {formData.underlyingToken === CONTRACTS.USDC ? 'USDC' : 'IDRX'} Amount
                  </Label>
                  <Input
                    id="amountUnderlying"
                    type="number"
                    placeholder="0.0"
                    value={formData.amountUnderlying}
                    onChange={(e) => setFormData(prev => ({ ...prev, amountUnderlying: e.target.value }))}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500"
                    disabled={isCreatingPool}
                    step="0.000001"
                    min="0"
                  />
                </div>
              </div>

              {/* Property Name (Auto-filled) */}
              <div className="space-y-2">
                <Label htmlFor="propertyName" className="text-gray-300">
                  Property Name
                </Label>
                <Input
                  id="propertyName"
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyName: e.target.value }))}
                  className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500"
                  disabled={isCreatingPool}
                  placeholder="Auto-filled from YRT series"
                />
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Advanced Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slippage" className="text-gray-300">
                      Slippage Tolerance (%)
                    </Label>
                    <Input
                      id="slippage"
                      type="number"
                      placeholder="1"
                      value={formData.slippage}
                      onChange={(e) => setFormData(prev => ({ ...prev, slippage: e.target.value }))}
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500"
                      disabled={isCreatingPool}
                      step="0.1"
                      min="0"
                      max="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-gray-300">
                      Deadline (minutes)
                    </Label>
                    <Input
                      id="deadline"
                      type="number"
                      placeholder="20"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-gray-500"
                      disabled={isCreatingPool}
                      step="1"
                      min="1"
                      max="1440"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isConnected || isCreatingPool || poolExists}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
              >
                {isCreatingPool ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Pool...
                  </>
                ) : poolExists ? (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Pool Already Exists
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Pool
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 space-y-4">
          <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="text-blue-400 font-medium mb-2">About Liquidity Pools</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Liquidity pools enable decentralized trading between YRT tokens and underlying assets (USDC/IDRX).
              When you create a pool, you provide both tokens and receive LP tokens representing your share of the pool.
            </p>
          </div>

          <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <h3 className="text-yellow-400 font-medium mb-2">Important Notes</h3>
            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
              <li>You will receive LP tokens representing your share of the pool</li>
              <li>You'll earn trading fees from swaps in your pool</li>
              <li>Impermanent loss can occur when token prices diverge</li>
              <li>Pool creation requires both tokens to be available in your wallet</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}