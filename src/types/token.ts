export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  type: 'crypto' | 'stablecoin' | 'rwa';
}

export interface TokenHolding {
  tokenId: string;
  balance: number;
  value: number;
}

export type TokenType = 'crypto' | 'stablecoin' | 'rwa';

export interface TokenMetadata {
  description?: string;
  website?: string;
  twitter?: string;
  coingeckoId?: string;
}

export interface TokenPrice {
  current: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: Date;
}