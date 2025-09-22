import { Token } from './token';

export interface LendingMarket {
  tokenId: string;
  token: Token;
  supplyAPY: number;
  borrowAPY: number;
  totalSupplied: number;
  totalBorrowed: number;
  utilizationRate: number;
  liquidityAvailable: number;
  minimumAmount: number;
}

export interface LendingPosition {
  id: string;
  tokenId: string;
  type: 'supply' | 'borrow';
  amount: number;
  apy: number;
  startDate: Date;
  accruedInterest: number;
}

export interface MarketStats {
  totalSupplied: number;
  totalBorrowed: number;
  totalEarned: number;
  activePositions: number;
}

export interface MarketFilter {
  tokenType?: 'crypto' | 'stablecoin' | 'rwa';
  minAPY?: number;
  minLiquidity?: number;
  sortBy: 'apy' | 'liquidity' | 'utilization';
  sortOrder: 'asc' | 'desc';
}

export interface MarketAction {
  type: 'supply' | 'borrow' | 'withdraw' | 'repay';
  tokenId: string;
  amount: number;
  positionId?: string;
}