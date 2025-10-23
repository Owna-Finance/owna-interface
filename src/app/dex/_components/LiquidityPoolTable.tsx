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

    return pools.filter(() => {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-white">Liquidity Pools</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search pools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none text-sm w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2A2A2A]">
                <th className="text-left py-3 px-3 text-sm font-medium text-gray-400 w-[30%]">Pool</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-400 w-[12%]">TVL</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-400 w-[12%]">24h Volume</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-400 w-[10%]">APR</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-400 w-[12%]">Price</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-400 w-[12%]">24h Change</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-400 w-[12%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPools.map((poolAddress) => (
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

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {filteredPools.map((poolAddress) => (
          <PoolCard
            key={poolAddress}
            poolAddress={poolAddress}
            onSelect={() => onPoolSelect?.(poolAddress)}
            isSelected={selectedPool === poolAddress}
          />
        ))}
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
  const { reserves, token0, token1, propertyName, isLoading: isLoadingPool } = usePoolDetails(poolAddress);
  const tokenAInfo = useTokenInfo(token0 as `0x${string}`);
  const tokenBInfo = useTokenInfo(token1 as `0x${string}`);

  // Handle loading state
  if (isLoadingPool || !token0 || !token1) {
    return (
      <tr>
        <td colSpan={7} className="py-4 px-4 text-center text-gray-400">
          Loading pool data...
        </td>
      </tr>
    );
  }

  // Calculate real data from contracts
  const tokenASymbol = tokenAInfo?.symbol?.toString() || 'YRT';
  const tokenBSymbol = tokenBInfo?.symbol?.toString() || 'USDC';

  // Calculate TVL from reserves
  const tvl = reserves && Array.isArray(reserves) ?
    parseFloat(formatUnits(reserves[0], 18)) + parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate price based on reserves
  const price = reserves && Array.isArray(reserves) && reserves[1] && parseFloat(reserves[1].toString()) > 0 ?
    parseFloat(formatUnits(reserves[0], 18)) / parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate APR (simplified)
  const apr = tvl > 0 ? ((0.3 * 365 * 10000) / tvl) * 100 : 0; // Assuming $10k daily volume

  // Mock volume and change - would need separate tracking
  const volume24h = '0';
  const change24h = 0;

  // Get token logos
  const getTokenLogo = (symbol: string) => {
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
      <td className="py-4 px-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center">
              <Image src={getTokenLogo(tokenASymbol)} alt={tokenASymbol} width={16} height={16} className="rounded-full" />
            </div>
            <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center -ml-2">
              <Image src={getTokenLogo(tokenBSymbol)} alt={tokenBSymbol} width={16} height={16} className="rounded-full" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-white text-sm">
              {tokenASymbol} / {tokenBSymbol}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {propertyName ? String(propertyName) : `Pool ${poolAddress.slice(0, 6)}...${poolAddress.slice(-4)}`}
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-2 text-right">
        <div className="text-white font-medium text-sm">
          ${tvl.toFixed(2)}
        </div>
      </td>

      <td className="py-4 px-2 text-right">
        <div className="text-white text-sm">
          ${volume24h}
        </div>
      </td>

      <td className="py-4 px-2 text-right">
        <div className="text-green-400 font-medium text-sm">
          {apr.toFixed(2)}%
        </div>
      </td>

      <td className="py-4 px-2 text-right">
        <div className="text-white text-sm">
          ${price.toFixed(4)}
        </div>
      </td>

      <td className="py-4 px-2 text-center">
        <div className={`flex items-center justify-center space-x-1 ${changeColor}`}>
          {changeIcon}
          <span className="font-medium text-sm">
            {Math.abs(change24h).toFixed(2)}%
          </span>
        </div>
      </td>

      <td className="py-4 px-2 text-center">
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle trade action
            }}
            className="px-2 py-1 bg-white hover:bg-gray-200 text-black text-xs font-medium rounded-md transition-colors whitespace-nowrap"
          >
            Trade
          </button>
          <a
            href={`https://sepolia.basescan.org/address/${poolAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 hover:bg-[#2A2A2A] rounded-md transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </td>
    </tr>
  );
}

interface PoolCardProps {
  poolAddress: `0x${string}`;
  onSelect: () => void;
  isSelected: boolean;
}

function PoolCard({ poolAddress, onSelect, isSelected }: PoolCardProps) {
  const { reserves, token0, token1, propertyName, isLoading: isLoadingPool } = usePoolDetails(poolAddress);
  const tokenAInfo = useTokenInfo(token0 as `0x${string}`);
  const tokenBInfo = useTokenInfo(token1 as `0x${string}`);

  // Handle loading state
  if (isLoadingPool || !token0 || !token1) {
    return (
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-lg p-4">
        <div className="text-center text-gray-400">Loading pool data...</div>
      </div>
    );
  }

  // Calculate real data from contracts
  const tokenASymbol = tokenAInfo?.symbol?.toString() || 'YRT';
  const tokenBSymbol = tokenBInfo?.symbol?.toString() || 'USDC';

  // Calculate TVL from reserves
  const tvl = reserves && Array.isArray(reserves) ?
    parseFloat(formatUnits(reserves[0], 18)) + parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate price based on reserves
  const price = reserves && Array.isArray(reserves) && reserves[1] && parseFloat(reserves[1].toString()) > 0 ?
    parseFloat(formatUnits(reserves[0], 18)) / parseFloat(formatUnits(reserves[1], 18)) : 0;

  // Calculate APR (simplified)
  const apr = tvl > 0 ? ((0.3 * 365 * 10000) / tvl) * 100 : 0; // Assuming $10k daily volume

  // Mock volume and change - would need separate tracking
  const volume24h = '0';
  const change24h = 0;

  // Get token logos
  const getTokenLogo = (symbol: string) => {
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
    <div
      className={`bg-[#111111] border rounded-lg p-4 cursor-pointer transition-all hover:bg-[#1A1A1A] ${
        isSelected ? 'border-white bg-[#1a1a2e]' : 'border-[#2A2A2A]'
      }`}
      onClick={onSelect}
    >
      {/* Pool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-3 min-w-0 flex-1">
          <div className="flex items-center justify-center xs:justify-start space-x-2 flex-shrink-0 mb-3 xs:mb-0">
            <div className="w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center">
              <Image src={getTokenLogo(tokenASymbol)} alt={tokenASymbol} width={20} height={20} className="rounded-full" />
            </div>
            <div className="w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center -ml-3">
              <Image src={getTokenLogo(tokenBSymbol)} alt={tokenBSymbol} width={20} height={20} className="rounded-full" />
            </div>
          </div>
          <div className="min-w-0 flex-1 text-center xs:text-left">
            <div className="font-medium text-white text-lg truncate">
              {tokenASymbol} / {tokenBSymbol}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {propertyName ? String(propertyName) : `Pool ${poolAddress.slice(0, 6)}...${poolAddress.slice(-4)}`}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle trade action
            }}
            className="px-4 py-2 bg-white hover:bg-gray-200 text-black text-sm font-medium rounded-lg transition-colors"
          >
            Trade
          </button>
          <a
            href={`https://sepolia.basescan.org/address/${poolAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">TVL</div>
          <div className="text-white font-medium">${tvl.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">24h Volume</div>
          <div className="text-white">${volume24h}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">APR</div>
          <div className="text-green-400 font-medium">{apr.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Price</div>
          <div className="text-white">${price.toFixed(4)}</div>
        </div>
        <div className="sm:col-span-2">
          <div className="text-xs text-gray-400 mb-1">24h Change</div>
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            {changeIcon}
            <span className="font-medium">{Math.abs(change24h).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}