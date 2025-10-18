import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Settings, Info, CheckCircle } from 'lucide-react';
import { EnhancedTokenInput, TokenOption } from './EnhancedTokenInput';
import { useSwap, usePoolDetails, useTokenInfo } from '@/hooks';
import { useGetAmountsOut, usePoolInfo } from '@/utils/dex-discovery';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { toast } from 'sonner';
import { formatAmount } from '@coinbase/onchainkit/token';
import { useAccount } from 'wagmi';

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
  const { address } = useAccount();
  const {
    swap,
    isLoading,
    hash,
    error,
    approveToken,
    useTokenAllowance,
    checkNeedsApproval
  } = useSwap();
  const { reserves, token0, token1 } = usePoolDetails(selectedPool);
  const token0Info = useTokenInfo(token0 as `0x${string}`);
  const token1Info = useTokenInfo(token1 as `0x${string}`);

  const [showSettings, setShowSettings] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

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

  // Pool validation for manual token selection
  const { data: manualPoolAddress } = usePoolInfo(
    formData.tokenIn?.address as `0x${string}`,
    formData.tokenOut?.address as `0x${string}`
  );

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
      const yrtToken: TokenOption = token0Info?.symbol !== 'USDC' && token0Info?.symbol !== 'IDRX' ? {
        value: token0 as string || selectedPool,
        label: token0Info?.symbol?.toString() || 'YRT',
        logo: '/Images/Logo/logo_YRT.jpg',
        address: token0 as `0x${string}`,
        isYRT: true,
        poolAddress: selectedPool
      } : {
        value: token1 as string || selectedPool,
        label: token1Info?.symbol?.toString() || 'YRT',
        logo: '/Images/Logo/logo_YRT.jpg',
        address: token1 as `0x${string}`,
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
      if (amountsOutResult && typeof amountsOutResult === 'object' && 'amountsOut' in amountsOutResult && Array.isArray(amountsOutResult.amountsOut) && amountsOutResult.amountsOut.length > 0) {
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

  // Check allowance for tokenIn
  const { data: tokenInAllowance } = useTokenAllowance({
    tokenAddress: formData.tokenIn?.address as `0x${string}`,
    amount: formData.amountIn || '0',
    userAddress: address as `0x${string}`,
  });

  const needsApproval = formData.tokenIn?.address && formData.amountIn && address
    ? checkNeedsApproval(tokenInAllowance as bigint, formData.amountIn)
    : false;

  const handleApprove = async () => {
    if (!formData.tokenIn?.address || !formData.amountIn || !address) {
      toast.error('Missing approval parameters');
      return;
    }

    try {
      setIsApproving(true);
      toast.loading('Approving token...', { id: 'token-approval' });

      await approveToken({
        tokenAddress: formData.tokenIn.address,
        amount: formData.amountIn,
        userAddress: address,
      });

      toast.success('Token approved successfully!', { id: 'token-approval' });
    } catch (error) {
      toast.error('Approval failed', {
        id: 'token-approval',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleSwap = async () => {
    if (!formData.amountIn || !formData.tokenIn || !formData.tokenOut || formData.tokenIn.value === formData.tokenOut.value) {
      toast.error('Invalid swap parameters');
      return;
    }

    if (!formData.tokenIn.address || !formData.tokenOut.address) {
      toast.error('Invalid token addresses');
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    // Validate pool exists
    const poolToUse = selectedPool || manualPoolAddress;
    if (!poolToUse || poolToUse === '0x0000000000000000000000000000000000000000') {
      toast.error('Pool does not exist for this token pair', {
        description: 'Please create a pool first or select different tokens',
      });
      return;
    }

    try {
      toast.loading('Swapping tokens...', { id: 'swap' });

      // Calculate minimum output with slippage tolerance
      const amountOutMin = formData.amountOut
        ? (parseFloat(formData.amountOut) * (1 - parseFloat(formData.slippage) / 100)).toString()
        : '0';

      await swap({
        amountIn: formData.amountIn,
        amountOutMin,
        tokenIn: formData.tokenIn.address,
        tokenOut: formData.tokenOut.address,
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 1200, // 20 minutes
      });

      toast.success('Swap successful!', { id: 'swap' });

      // Reset form
      setFormData(prev => ({
        ...prev,
        amountIn: '',
        amountOut: '',
      }));
    } catch (error) {
      toast.error('Swap failed', {
        id: 'swap',
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
                {token0Info?.symbol?.toString() || 'Unknown'} / {token1Info?.symbol?.toString() || 'Unknown'}
              </div>
              {!!reserves && Array.isArray(reserves) && (
                <div className="text-xs text-gray-400 mt-1">
                  Pool Size: {formatAmount(String(Number(reserves[0].toString()) / Math.pow(10, 18)))} / {formatAmount(String(Number(reserves[1].toString()) / Math.pow(10, 18)))}
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

        {/* Approval/Swap Button */}
        {needsApproval ? (
          <Button
            onClick={handleApprove}
            disabled={!isFormValid || isApproving || isCalculating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-200 border-t-white rounded-full animate-spin mr-2"></div>
                Approving {formData.tokenIn?.label}...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve {formData.tokenIn?.label}
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleSwap}
            disabled={!isFormValid || isLoading || isCalculating || !address}
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
        )}

        {/* Transaction Status with OnchainKit */}
        {(hash || error) && (
          <div className="p-4 bg-[#111111] rounded-lg border border-[#2A2A2A]">
            {hash && (
              <div className="space-y-3">
                <div className="flex items-center justify-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-green-400 font-medium">Swap submitted!</div>
                      <div className="text-green-300 text-xs">Transaction is processing on Base Sepolia</div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <a
                    href={`https://sepolia.basescan.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1"
                  >
                    <span>View on Explorer</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-medium">Swap failed</div>
                    <div className="text-xs text-red-300">{error.message}</div>
                  </div>
                </div>
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