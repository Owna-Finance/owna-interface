import { useState } from 'react';
import { ExternalLink, TrendingUp, Users, DollarSign } from 'lucide-react';
import { usePoolDetails, useTokenInfo } from '@/hooks';
import { formatUnits } from 'viem';
import Image from 'next/image';
import { CONTRACTS } from '@/constants/contracts/contracts';

interface PoolInformationPanelProps {
  poolAddress: `0x${string}`;
}

export function PoolInformationPanel({ poolAddress }: PoolInformationPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'holders' | 'analytics'>('overview');
  const { reserves, token0, token1, totalSupply, propertyName, isLoading } = usePoolDetails(poolAddress);
  const tokenAInfo = useTokenInfo(token0 as `0x${string}`);
  const tokenBInfo = useTokenInfo(token1 as `0x${string}`);

  // Use real data from contracts

  const getTokenLogo = (address: string, symbol: string) => {
    if (address === CONTRACTS.USDC) return '/Images/Logo/usdc-logo.png';
    if (address === CONTRACTS.IDRX) return '/Images/Logo/idrx-logo.svg';
    return '/Images/Logo/logo_YRT.jpg'; // Default for YRT tokens
  };

  const tokenA = {
    symbol: tokenAInfo?.symbol?.toString() || 'YRT',
    name: tokenAInfo?.name?.toString() || 'YRT Token',
    address: token0?.toString() || '',
    logo: getTokenLogo(token0?.toString() || '', tokenAInfo?.symbol?.toString() || ''),
  };

  const tokenB = {
    symbol: tokenBInfo?.symbol?.toString() || 'USDC',
    name: tokenBInfo?.name?.toString() || 'USD Coin',
    address: token1?.toString() || '',
    logo: getTokenLogo(token1?.toString() || '', tokenBInfo?.symbol?.toString() || ''),
  };

  // Calculate reserves from contract data
  const reserveA = reserves && Array.isArray(reserves) ? formatUnits(reserves[0], 18) : '0';
  const reserveB = reserves && Array.isArray(reserves) ? formatUnits(reserves[1], 18) : '0';
  const formattedTotalSupply = totalSupply && typeof totalSupply === 'bigint' ? formatUnits(totalSupply, 18) : '0';

  // Calculate TVL (sum of both reserves)
  const tvl = reserves && Array.isArray(reserves) ?
    parseFloat(formatUnits(reserves[0], 18)) + parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate APR (mock calculation - would need volume data)
  const apr = tvl > 0 ? ((0.3 * 365 * 25000) / tvl) * 100 : 0; // Assuming $25k daily volume, 0.3% fee

  if (isLoading || !tokenAInfo || !tokenBInfo) {
    return (
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Pool Information</h3>
        <a
          href={`https://sepolia.basescan.org/address/${poolAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      </div>

      {/* Token Pair */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center">
            <Image src={tokenA.logo} alt={tokenA.symbol} width={20} height={20} />
          </div>
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center -ml-2">
            <Image src={tokenB.logo} alt={tokenB.symbol} width={20} height={20} />
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium text-white">
            {tokenA.symbol} / {tokenB.symbol}
          </div>
          <div className="text-xs text-gray-400">{propertyName?.toString() || 'Property'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-[#111111] rounded-lg p-1">
        {['overview', 'holders', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111111] rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">TVL</span>
                </div>
                <div className="text-lg font-semibold text-white">
                  ${tvl.toFixed(2)}
                </div>
              </div>
              <div className="bg-[#111111] rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">APR</span>
                </div>
                <div className="text-lg font-semibold text-green-400">
                  {apr.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Reserves */}
            <div className="bg-[#111111] rounded-lg p-4">
              <div className="text-sm font-medium text-gray-400 mb-3">Reserves</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src={tokenA.logo} alt={tokenA.symbol} width={16} height={16} />
                    <span className="text-white">{tokenA.symbol}</span>
                  </div>
                  <span className="text-white font-medium">{parseFloat(reserveA).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Image src={tokenB.logo} alt={tokenB.symbol} width={16} height={16} />
                    <span className="text-white">{tokenB.symbol}</span>
                  </div>
                  <span className="text-white font-medium">{parseFloat(reserveB).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Volume */}
            <div className="bg-[#111111] rounded-lg p-4">
              <div className="text-sm font-medium text-gray-400 mb-3">24h Volume</div>
              <div className="flex justify-between items-center">
                <span className="text-white">--</span>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Fees</div>
                  <div className="text-sm font-medium text-white">--</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'holders' && (
          <div className="space-y-4">
            <div className="bg-[#111111] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-400">Total Holders</span>
                </div>
                <span className="text-lg font-semibold text-white">--</span>
              </div>
            </div>

            {/* Top Holders */}
            <div className="bg-[#111111] rounded-lg p-4">
              <div className="text-sm font-medium text-gray-400 mb-3">Top Holders</div>
              <div className="space-y-2">
                <div className="text-center text-gray-400 text-sm py-4">
                  Holder data not available yet
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-[#111111] rounded-lg p-4">
              <div className="text-sm font-medium text-gray-400 mb-3">Pool Performance</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Created</span>
                  <span className="text-white text-sm">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">All-time Volume</span>
                  <span className="text-white text-sm">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">All-time Fees</span>
                  <span className="text-white text-sm">--</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] rounded-lg p-4">
              <div className="text-sm font-medium text-gray-400 mb-3">Price Range (24h)</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">High</span>
                  <span className="text-green-400 text-sm">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Low</span>
                  <span className="text-red-400 text-sm">--</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Current</span>
                  <span className="text-white text-sm font-medium">--</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}