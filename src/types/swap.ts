import { Token } from './token';

export interface SwapTransaction {
  id: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  slippage: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  priceImpact: number;
  minimumReceived: number;
  fee: number;
  route: SwapRoute[];
}

export interface SwapRoute {
  tokenIn: Token;
  tokenOut: Token;
  percentage: number;
  pool: string;
}

export interface SwapSettings {
  slippage: number;
  deadline: number;
  autoRouting: boolean;
}

export type SwapStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SwapError {
  code: 'INSUFFICIENT_BALANCE' | 'SLIPPAGE_EXCEEDED' | 'NETWORK_ERROR' | 'INVALID_PAIR';
  message: string;
}