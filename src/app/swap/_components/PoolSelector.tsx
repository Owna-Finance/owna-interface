'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAllPools } from '@/hooks/useAllPools';
import { CONTRACTS } from '@/constants/contracts/contracts';
import { Loader2, TrendingUp, Building } from 'lucide-react';

interface PoolSelectorProps {
  selectedPool: string;
  onPoolSelect: (poolAddress: string, token0: string, token1: string, propertyName?: string) => void;
  onTokenSelect: (tokenFrom: string, tokenTo: string) => void;
}

export function PoolSelector({ selectedPool, onPoolSelect, onTokenSelect }: PoolSelectorProps) {
  const { pools, isLoading, getYRTPools } = useAllPools();
  const [selectedPoolAddress, setSelectedPoolAddress] = useState(selectedPool);

  const yrtPools = getYRTPools();
  const availableTokens = [
    { value: CONTRACTS.USDC, label: 'USDC', symbol: 'USDC' },
    { value: CONTRACTS.IDRX, label: 'IDRX', symbol: 'IDRX' },
  ];

  const handlePoolChange = (poolAddress: string) => {
    setSelectedPoolAddress(poolAddress);
    const pool = pools.find(p => p.address === poolAddress);

    if (pool) {
      // Determine which token is YRT and which is stablecoin
      let tokenFrom, tokenTo;

      if (pool.isYRTPool) {
        // If first token is YRT, swap direction for better UX (stablecoin -> YRT)
        if (pool.token0Symbol.includes('YRT')) {
          tokenFrom = pool.token1Symbol; // Stablecoin
          tokenTo = pool.token0Symbol;    // YRT
        } else {
          tokenFrom = pool.token0Symbol; // Stablecoin
          tokenTo = pool.token1Symbol;    // YRT
        }
      } else {
        tokenFrom = pool.token0Symbol;
        tokenTo = pool.token1Symbol;
      }

      onPoolSelect(poolAddress, pool.token0, pool.token1, pool.propertyName);
      onTokenSelect(tokenFrom, tokenTo);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Select Liquidity Pool</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Loading pools...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Select Liquidity Pool</span>
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Choose a pool to trade tokens. YRT pools allow trading between property tokens and stablecoins.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pool Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Available Pools</label>
          <Select value={selectedPoolAddress} onValueChange={handlePoolChange}>
            <SelectTrigger className="bg-[#2A2A2A] border-[#3A3A3A] text-white">
              <SelectValue placeholder="Select a pool" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] max-h-96">
              {yrtPools.length > 0 && (
                <div className="p-2">
                  <p className="text-xs text-gray-500 font-medium px-2 py-1">YRT POOLS</p>
                  {yrtPools.map((pool) => (
                    <SelectItem
                      key={pool.address}
                      value={pool.address}
                      className="text-white hover:bg-[#3A3A3A]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                            YRT
                          </Badge>
                          <span className="font-medium">
                            {pool.token0Symbol.includes('YRT') ? pool.token1Symbol : pool.token0Symbol}
                            {' '}
                            ↔
                            {' '}
                            {pool.token0Symbol.includes('YRT') ? pool.token0Symbol : pool.token1Symbol}
                          </span>
                        </div>
                      </div>
                      {pool.propertyName && (
                        <p className="text-xs text-gray-500 mt-1">
                          <Building className="w-3 h-3 inline mr-1" />
                          {pool.propertyName}
                        </p>
                      )}
                    </SelectItem>
                  ))}
                </div>
              )}

              {pools.filter(p => !p.isYRTPool).length > 0 && (
                <div className="p-2">
                  <p className="text-xs text-gray-500 font-medium px-2 py-1">OTHER POOLS</p>
                  {pools.filter(p => !p.isYRTPool).map((pool) => (
                    <SelectItem
                      key={pool.address}
                      value={pool.address}
                      className="text-white hover:bg-[#3A3A3A]"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">
                          {pool.token0Symbol} ↔ {pool.token1Symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              )}

              {pools.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-gray-500 text-sm">No pools available</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Create a pool first to start trading
                  </p>
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Pool Info */}
        {selectedPoolAddress && selectedPoolAddress !== '0x0000000000000000000000000000000000000000' && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Selected Pool</h4>
            {(() => {
              const pool = pools.find(p => p.address === selectedPoolAddress);
              if (!pool) return null;

              return (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pair:</span>
                    <span className="text-white">
                      {pool.token0Symbol} / {pool.token1Symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reserves:</span>
                    <span className="text-white">
                      {pool.reserve0} / {pool.reserve1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee:</span>
                    <span className="text-white">{pool.swapFee}%</span>
                  </div>
                  {pool.propertyName && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Property:</span>
                      <span className="text-white">{pool.propertyName}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Create Pool CTA */}
        {pools.length === 0 && (
          <div className="text-center py-4">
            <Button
              onClick={() => window.location.href = '/trading/create-pool'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create First Pool
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}