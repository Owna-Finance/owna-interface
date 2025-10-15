import { useState, useMemo } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLiquidityPoolsData, useSimplePoolList, useTokenInfo, usePoolDetails } from '@/hooks';
import { formatUnits } from 'viem';
import Image from 'next/image';
import { CONTRACTS } from '@/constants/contracts/contracts';

interface LiquidityPoolTableProps {
  onPoolSelect?: (pool: any) => void;
  selectedPool?: any;
}

export function LiquidityPoolTable({ onPoolSelect, selectedPool }: LiquidityPoolTableProps) {
  // Try simple pool list first for debugging
  const simplePoolList = useSimplePoolList();
  const complexPoolList = useLiquidityPoolsData();

  // Use simple pools as fallback
  const pools = simplePoolList.pools.length > 0 ? simplePoolList.pools : complexPoolList.pools;
  const isLoading = simplePoolList.isLoading || complexPoolList.isLoading;
  const isError = simplePoolList.isError || complexPoolList.isError;

  const [searchTerm, setSearchTerm] = useState('');

  
  // Filter pools based on search
  const filteredPools = useMemo(() => {
    if (!pools || pools.length === 0) return [];

    return pools.filter(pool => {
      // This is a placeholder - we'd need to fetch pool details
      // For now, we'll just return all pools
      return true;
    });
  }, [pools, searchTerm]);

  if (isLoading) {
    return (
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
        <div className="text-center py-12">
          <p className="text-red-400">Error loading liquidity pools</p>
        </div>
      </div>
    );
  }

  if (filteredPools.length === 0) {
    return (
      <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">
            {isLoading ? 'Loading pools...' : 'No liquidity pools found'}
          </p>
          {!isLoading && (
            <div className="mt-4 text-xs text-gray-500">
              <p>Try creating a pool first, or check if contracts are deployed correctly.</p>
              <p>Factory: {CONTRACTS.DEX_FACTORY}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Liquidity Pools</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Pool</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">TVL</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">24h Volume</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">APR</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Price</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">24h Change</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPools.map((poolAddress, index) => (
              <PoolRow
                key={poolAddress}
                poolAddress={poolAddress}
                onSelect={() => onPoolSelect?.(poolAddress)}
                isSelected={selectedPool === poolAddress}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PoolRowProps {
  poolAddress: `0x${string}`;
  onSelect: () => void;
  isSelected: boolean;
}

function PoolRow({ poolAddress, onSelect, isSelected }: PoolRowProps) {
  const { tokenInfo: tokenAInfo } = useTokenInfo(poolAddress);
  const { tokenInfo: tokenBInfo } = useTokenInfo(poolAddress);
  const { reserves, token0, token1, propertyName, isLoading: isLoadingPool } = usePoolDetails(poolAddress);

  // Calculate real data from contracts
  const tokenASymbol = tokenAInfo?.symbol || 'YRT';
  const tokenBSymbol = tokenBInfo?.symbol || 'USDC';

  // Calculate TVL from reserves
  const tvl = reserves ?
    parseFloat(formatUnits(reserves[0], 18)) + parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate price based on reserves
  const price = reserves && reserves[1] > 0 ?
    parseFloat(formatUnits(reserves[0], 18)) / parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate APR (simplified)
  const apr = tvl > 0 ? ((0.3 * 365 * 10000) / tvl) * 100 : 0; // Assuming $10k daily volume

  // Mock volume and change - would need separate tracking
  const volume24h = '0';
  const change24h = 0;

  // Get token logos
  const getTokenLogo = (symbol: string, address: string) => {
    if (symbol === 'USDC') return '/Images/Logo/usdc-logo.png';
    if (symbol === 'IDRX') return '/Images/Logo/idrx-logo.svg';
    return '/Images/Logo/logo_YRT.jpg'; // Default for YRT tokens
  };

  const changeIcon = change24h > 0 ? (
    <TrendingUp className="w-4 h-4 text-green-500" />
  ) : change24h < 0 ? (
    <TrendingDown className="w-4 h-4 text-red-500" />
  ) : (
    <Minus className="w-4 h-4 text-gray-500" />
  );

  const changeColor = change24h > 0 ? 'text-green-500' : change24h < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <tr
      className={`border-b border-[#1A1A1A] hover:bg-[#111111] cursor-pointer transition-colors ${
        isSelected ? 'bg-[#1a1a2e]' : ''
      }`}
      onClick={onSelect}
    >
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center">
              <Image src={getTokenLogo(tokenASymbol, token0 || '')} alt={tokenASymbol} width={16} height={16} />
            </div>
            <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center -ml-2">
              <Image src={getTokenLogo(tokenBSymbol, token1 || '')} alt={tokenBSymbol} width={16} height={16} />
            </div>
          </div>
          <div>
            <div className="font-medium text-white">
              {tokenASymbol} / {tokenBSymbol}
            </div>
            <div className="text-xs text-gray-400">
              Pool: {poolAddress.slice(0, 6)}...{poolAddress.slice(-4)}
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <div className="text-white font-medium">
          ${tvl.toFixed(2)}
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <div className="text-white">
          ${volume24h}
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <div className="text-green-400 font-medium">
          {apr.toFixed(2)}%
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <div className="text-white">
          ${price.toFixed(4)}
        </div>
      </td>

      <td className="py-4 px-4 text-center">
        <div className={`flex items-center justify-center space-x-1 ${changeColor}`}>
          {changeIcon}
          <span className="font-medium">
            {Math.abs(change24h).toFixed(2)}%
          </span>
        </div>
      </td>

      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle trade action
            }}
            className="px-3 py-1 bg-white hover:bg-gray-200 text-black text-sm font-medium rounded-lg transition-colors"
          >
            Trade
          </button>
          <a
            href={`https://sepolia.basescan.org/address/${poolAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </td>
    </tr>
  );
}