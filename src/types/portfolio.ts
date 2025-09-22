import { TokenHolding } from './token';

export interface Portfolio {
  totalBalance: number;
  tokens: TokenHolding[];
  allocations: {
    crypto: number;
    stablecoin: number;
    rwa: number;
  };
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  lastUpdated: Date;
}

export interface PortfolioPerformance {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  returnPercentage: number;
  returnValue: number;
  benchmark?: number;
}

export interface PortfolioAllocation {
  tokenId: string;
  percentage: number;
  value: number;
  target?: number;
}

export interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalTokens: number;
  topHolding: TokenHolding | null;
}