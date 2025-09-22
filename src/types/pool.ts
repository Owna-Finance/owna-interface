import { Token } from './token';

export interface LiquidityPool {
  id: string;
  token0: Token;
  token1: Token;
  token0Reserve: number;
  token1Reserve: number;
  totalLiquidity: number;
  apy: number;
  fee: number;
  volume24h: number;
}

export interface LiquidityPosition {
  id: string;
  poolId: string;
  pool: LiquidityPool;
  token0Amount: number;
  token1Amount: number;
  lpTokens: number;
  shareOfPool: number;
  startDate: Date;
}

export interface PoolStats {
  totalLiquidity: number;
  totalVolume24h: number;
  totalFees24h: number;
  totalPools: number;
  topPool: LiquidityPool | null;
}

export interface PoolFilter {
  tokenType?: 'crypto' | 'stablecoin' | 'rwa';
  minLiquidity?: number;
  minAPY?: number;
  sortBy: 'apy' | 'liquidity' | 'volume';
  sortOrder: 'asc' | 'desc';
}

export interface LiquidityAction {
  type: 'add' | 'remove';
  poolId: string;
  token0Amount: number;
  token1Amount: number;
  positionId?: string;
  percentage?: number;
}