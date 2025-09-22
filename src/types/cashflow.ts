import { Token } from './token';

export interface CashflowRecord {
  id: string;
  rwaTokenId: string;
  rwaToken: Token;
  amount: number;
  currency: 'USD';
  date: Date;
  type: 'rental' | 'dividend' | 'interest';
  propertyId: string;
  accumulatedTotal: number;
}

export interface CashflowSummary {
  totalAccumulated: number;
  monthlyAverage: number;
  yearlyProjected: number;
  topPerformingToken: string;
  totalProperties: number;
}

export interface CashflowMetrics {
  period: '7d' | '30d' | '90d' | '1y';
  totalAmount: number;
  averageAmount: number;
  transactionCount: number;
  growth: number;
}

export interface CashflowFilter {
  tokenId?: string;
  type?: 'rental' | 'dividend' | 'interest';
  dateRange?: {
    start: Date;
    end: Date;
  };
  minAmount?: number;
}

export interface PropertyMetrics {
  propertyId: string;
  totalCashflow: number;
  monthlyAverage: number;
  occupancyRate: number;
  roi: number;
}