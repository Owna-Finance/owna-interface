import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Settings, Info } from 'lucide-react';
import { EnhancedTokenInput, TokenOption } from './EnhancedTokenInput';
import { useSwap, usePoolDetails, useTokenInfo } from '@/hooks';
import { useGetAmountsOut } from '@/utils/dex-discovery';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { toast } from 'sonner';

interface EnhancedSwapFormProps {
  selectedPool?: `0x${string}`;
  availablePools?: `0x${string}`[];
}

interface SwapFormData {
  tokenIn: TokenOption | null;
  tokenOut: TokenOption | null;
  amountIn: string;
  amountOut: string;
  slippage: string;
}

export function EnhancedSwapForm({ selectedPool, availablePools = [] }: EnhancedSwapFormProps) {
  const { swap, isLoading, hash, isSuccess, error } = useSwap();
  const { reserves, token0, token1 } = usePoolDetails(selectedPool);
  const { tokenInfo: token0Info } = useTokenInfo(token0);
  const { tokenInfo: token1Info } = useTokenInfo(token1);

  const [showSettings, setShowSettings] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Default token options
  const defaultUSDC: TokenOption = {
    value: 'USDC',
    label: 'USDC',
    logo: '/Images/Logo/usdc-logo.png',
    address: CONTRACTS.USDC,
    isYRT: false
  };

  const [formData, setFormData] = useState<SwapFormData>({
    tokenIn: defaultUSDC,
    tokenOut: null,
    amountIn: '',
    amountOut: '',
    slippage: '1.0',
  });

  // Use getAmountsOut as a hook with proper parameters
  const tokenPath = formData.tokenIn?.address && formData.tokenOut?.address
    ? [formData.tokenIn.address, formData.tokenOut.address]
    : [CONTRACTS.USDC, CONTRACTS.USDC];

  const { data: amountsOutResult, isLoading: isLoadingAmountsOut } = useGetAmountsOut(
    formData.amountIn || '0',
    tokenPath
  );

  // Auto-select tokens based on selected pool
  useEffect(() => {
    if (selectedPool && token0Info && token1Info && availablePools.length > 0) {
      // Determine which token is YRT and which is stablecoin
      const yrtToken = token0Info?.symbol !== 'USDC' && token0Info?.symbol !== 'IDRX' ? {
        value: token0 || selectedPool,
        label: token0Info?.symbol || 'YRT',
        logo: '/Images/Logo/logo_YRT.jpg',
        address: token0,
        isYRT: true,
        poolAddress: selectedPool
      } : {
        value: token1 || selectedPool,
        label: token1Info?.symbol || 'YRT',
        logo: '/Images/Logo/logo_YRT.jpg',
        address: token1,
        isYRT: true,
        poolAddress: selectedPool
      };

      // Set YRT as tokenOut if not already selected
      if (!formData.tokenOut || formData.tokenOut.value !== yrtToken.value) {
        setFormData(prev => ({
          ...prev,
          tokenOut: yrtToken,
        }));
      }
    }
  }, [selectedPool, token0Info, token1Info, token0, token1, availablePools]);

  // Calculate output amount when input changes
  useEffect(() => {
    if (formData.amountIn && formData.tokenIn && formData.tokenOut && formData.tokenIn.value !== formData.tokenOut.value) {
      setIsCalculating(true);
    } else {
      setFormData(prev => ({ ...prev, amountOut: '' }));
    }
  }, [formData.amountIn, formData.tokenIn, formData.tokenOut]);

  // Update output amount when getAmountsOut result changes
  useEffect(() => {
    if (!isLoadingAmountsOut && amountsOutResult && formData.amountIn && formData.tokenIn && formData.tokenOut && formData.tokenIn.value !== formData.tokenOut.value) {
      if (amountsOutResult && amountsOutResult.amountsOut && amountsOutResult.amountsOut.length > 0) {
        // Convert from BigInt to string with proper decimal handling
        const outputAmount = amountsOutResult.amountsOut[amountsOutResult.amountsOut.length - 1].toString();
        setFormData(prev => ({ ...prev, amountOut: outputAmount }));
      } else {
        // Fallback to simple calculation if DEX call fails
        const mockOutput = (parseFloat(formData.amountIn) * 0.95).toString();
        setFormData(prev => ({ ...prev, amountOut: mockOutput }));
      }
      setIsCalculating(false);
    }
  }, [amountsOutResult, isLoadingAmountsOut, formData.amountIn, formData.tokenIn, formData.tokenOut]);

  const handleSwap = async () => {
    if (!formData.amountIn || !formData.tokenIn || !formData.tokenOut || formData.tokenIn.value === formData.tokenOut.value) {
      toast.error('Invalid swap parameters');
      return;
    }

    if (!formData.tokenIn.address || !formData.tokenOut.address) {
      toast.error('Invalid token addresses');
      return;
    }

    try {
      // Create token path for swap
      const path = [formData.tokenIn.address, formData.tokenOut.address];

      // Calculate minimum output with slippage tolerance
      const amountOutMin = formData.amountOut
        ? (parseFloat(formData.amountOut) * (1 - parseFloat(formData.slippage) / 100)).toString()
        : '0';

      await swap({
        amountIn: formData.amountIn,
        amountOutMin,
        tokenIn: formData.tokenIn.address,
        tokenOut: formData.tokenOut.address,
        recipient: '0x0000000000000000000000000000000000000000', // TODO: Get actual user address
        deadline: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
      });
    } catch (error) {
      console.error('Swap error:', error);
      toast.error('Swap failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleSwapTokens = () => {
    setFormData(prev => ({
      ...prev,
      tokenIn: prev.tokenOut,
      tokenOut: prev.tokenIn,
      amountIn: prev.amountOut,
      amountOut: prev.amountIn,
    }));
  };

  const isFormValid = formData.amountIn &&
                     parseFloat(formData.amountIn) > 0 &&
                     formData.tokenIn &&
                     formData.tokenOut &&
                     formData.tokenIn.value !== formData.tokenOut.value;

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Swap</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Pool Info (if selected) */}
      {selectedPool && token0Info && token1Info && (
        <div className="mb-6 p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Selected Pool</div>
              <div className="font-medium text-white">
                {token0Info?.symbol} / {token1Info?.symbol}
              </div>
              {reserves && (
                <div className="text-xs text-gray-400 mt-1">
                  Pool Size: {reserves[0].toString()} / {reserves[1].toString()}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Pool Address</div>
              <div className="font-mono text-xs text-white">
                {selectedPool.slice(0, 6)}...{selectedPool.slice(-4)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Form */}
      <div className="space-y-4">
        {/* Token In */}
        <EnhancedTokenInput
          label="You Pay"
          selectedToken={formData.tokenIn}
          onTokenChange={(token) => setFormData(prev => ({ ...prev, tokenIn: token }))}
          onAmountChange={(value) => setFormData(prev => ({ ...prev, amountIn: value }))}
          amount={formData.amountIn}
          availablePools={availablePools}
          selectedPool={selectedPool}
        />

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleSwapTokens}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-800 p-2"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        {/* Token Out */}
        <EnhancedTokenInput
          label="You Receive"
          selectedToken={formData.tokenOut}
          onTokenChange={(token) => setFormData(prev => ({ ...prev, tokenOut: token }))}
          onAmountChange={(value) => setFormData(prev => ({ ...prev, amountOut: value }))}
          amount={formData.amountOut}
          readOnly
          availablePools={availablePools}
          selectedPool={selectedPool}
        />

        {/* Calculation indicator */}
        {isCalculating && (
          <div className="flex items-center justify-center py-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin mr-2"></div>
            <span className="text-sm text-gray-400">Calculating best route...</span>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slippage Tolerance (%)
                </label>
                <input
                  type="number"
                  value={formData.slippage}
                  onChange={(e) => setFormData(prev => ({ ...prev, slippage: e.target.value }))}
                  step="0.1"
                  min="0.1"
                  max="50"
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white focus:border-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!isFormValid || isLoading || isCalculating}
          className="w-full bg-white hover:bg-gray-200 text-black font-medium py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin mr-2"></div>
              Swapping...
            </>
          ) : (
            'Swap'
          )}
        </Button>

        {/* Transaction Status */}
        {(hash || error) && (
          <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
            {isSuccess && hash && (
              <div className="text-green-400 text-sm">
                ✓ Swap successful!
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-400 hover:text-blue-300 mt-1"
                >
                  View on Explorer
                </a>
              </div>
            )}
            {error && (
              <div className="text-red-400 text-sm">
                ✗ Swap failed: {error.message}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <Info className="w-3 h-3" />
          <span>Trading on Owna-DEX AMM with 0.3% fee</span>
        </div>
      </div>
    </div>
  );
}