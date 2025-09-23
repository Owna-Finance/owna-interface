import { Token, TokenHolding } from '@/types/token';
import { Portfolio } from '@/types/portfolio';
import { LendingMarket } from '@/types/market';
import { LiquidityPool } from '@/types/pool';
import { CashflowRecord } from '@/types/cashflow';
import { GovernanceProposal } from '@/types/governance';

// Mock Tokens
export const MOCK_TOKENS: Token[] = [
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoUrl: '/tokens/eth.svg',
    price: 2045.67,
    priceChange24h: 2.34,
    marketCap: 245678900000,
    type: 'crypto'
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    logoUrl: '/tokens/btc.svg',
    price: 43250.80,
    priceChange24h: -1.23,
    marketCap: 847000000000,
    type: 'crypto'
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoUrl: '/tokens/usdc.svg',
    price: 1.00,
    priceChange24h: 0.01,
    marketCap: 32000000000,
    type: 'stablecoin'
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoUrl: '/tokens/usdt.svg',
    price: 0.9998,
    priceChange24h: -0.02,
    marketCap: 91000000000,
    type: 'stablecoin'
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoUrl: '/tokens/dai.svg',
    price: 1.001,
    priceChange24h: 0.05,
    marketCap: 5200000000,
    type: 'stablecoin'
  },
  // Yield-bearing tokens (yrt)
  {
    id: 'yrt-btc',
    symbol: 'yrtBTC',
    name: 'Yield BTC',
    decimals: 8,
    logoUrl: '/tokens/btc.svg',
    price: 43150.20,
    priceChange24h: -1.15,
    marketCap: 420000000,
    type: 'crypto'
  },
  {
    id: 'yrt-eth',
    symbol: 'yrtETH',
    name: 'Yield ETH',
    decimals: 18,
    logoUrl: '/tokens/eth.svg',
    price: 2040.85,
    priceChange24h: 2.12,
    marketCap: 156000000,
    type: 'crypto'
  },
  {
    id: 'yrt-usdt',
    symbol: 'yrtUSDT',
    name: 'Yield USDT',
    decimals: 6,
    logoUrl: '/tokens/usdt.svg',
    price: 1.002,
    priceChange24h: 0.02,
    marketCap: 85000000,
    type: 'stablecoin'
  },
  {
    id: 'yrt-usdc',
    symbol: 'yrtUSDC',
    name: 'Yield USDC',
    decimals: 6,
    logoUrl: '/tokens/usdc.svg',
    price: 1.001,
    priceChange24h: 0.01,
    marketCap: 92000000,
    type: 'stablecoin'
  },
  {
    id: 'yrt-base',
    symbol: 'yrtBase',
    name: 'Yield Base',
    decimals: 18,
    logoUrl: '/Images/Logo/base-logo.png',
    price: 1.85,
    priceChange24h: 1.23,
    marketCap: 12000000,
    type: 'crypto'
  },
  {
    id: 'hotel-rwa-1',
    symbol: 'HRTL1',
    name: 'Hotel Resort Token #1',
    decimals: 18,
    logoUrl: '/tokens/hotel-rwa.svg',
    price: 125.50,
    priceChange24h: 0.85,
    marketCap: 5000000,
    type: 'rwa'
  },
  {
    id: 'hotel-rwa-2',
    symbol: 'HRTL2',
    name: 'Luxury Hotel Token #2',
    decimals: 18,
    logoUrl: '/tokens/hotel-rwa.svg',
    price: 87.25,
    priceChange24h: 1.42,
    marketCap: 3500000,
    type: 'rwa'
  },
  {
    id: 'hotel-rwa-3',
    symbol: 'HRTL3',
    name: 'Boutique Hotel Token #3',
    decimals: 18,
    logoUrl: '/tokens/hotel-rwa.svg',
    price: 156.75,
    priceChange24h: -0.32,
    marketCap: 7200000,
    type: 'rwa'
  }
];

// Mock Portfolio
export const MOCK_PORTFOLIO: Portfolio = {
  totalBalance: 0,
  tokens: [
    { tokenId: 'eth', balance: 3.5, value: 7159.85 },
    { tokenId: 'btc', balance: 0.15, value: 6487.62 },
    { tokenId: 'usdc', balance: 4500.00, value: 4500.00 },
    { tokenId: 'usdt', balance: 2000.00, value: 1999.60 },
    { tokenId: 'hotel-rwa-1', balance: 12.8, value: 1606.40 },
    { tokenId: 'hotel-rwa-2', balance: 18.5, value: 1614.13 },
    { tokenId: 'hotel-rwa-3', balance: 7.2, value: 1128.60 }
  ],
  allocations: {
    crypto: 58.2,
    stablecoin: 27.7,
    rwa: 14.1
  },
  performance: {
    daily: 1.23,
    weekly: 5.67,
    monthly: 12.34
  },
  lastUpdated: new Date()
};

// Mock Lending Markets
export const MOCK_LENDING_MARKETS: LendingMarket[] = [
  {
    tokenId: 'usdc',
    token: MOCK_TOKENS.find(t => t.id === 'usdc')!,
    supplyAPY: 4.25,
    borrowAPY: 6.75,
    totalSupplied: 12500000,
    totalBorrowed: 8750000,
    utilizationRate: 70,
    liquidityAvailable: 3750000,
    minimumAmount: 100
  },
  {
    tokenId: 'eth',
    token: MOCK_TOKENS.find(t => t.id === 'eth')!,
    supplyAPY: 3.85,
    borrowAPY: 7.25,
    totalSupplied: 45000,
    totalBorrowed: 32400,
    utilizationRate: 72,
    liquidityAvailable: 12600,
    minimumAmount: 0.1
  },
  {
    tokenId: 'dai',
    token: MOCK_TOKENS.find(t => t.id === 'dai')!,
    supplyAPY: 4.12,
    borrowAPY: 6.88,
    totalSupplied: 8900000,
    totalBorrowed: 6230000,
    utilizationRate: 70,
    liquidityAvailable: 2670000,
    minimumAmount: 100
  },
  // Yield-bearing tokens for market
  {
    tokenId: 'yrt-btc',
    token: MOCK_TOKENS.find(t => t.id === 'yrt-btc')!,
    supplyAPY: 5.85,
    borrowAPY: 8.45,
    totalSupplied: 2500000,
    totalBorrowed: 1750000,
    utilizationRate: 70,
    liquidityAvailable: 750000,
    minimumAmount: 0.001
  },
  {
    tokenId: 'yrt-eth',
    token: MOCK_TOKENS.find(t => t.id === 'yrt-eth')!,
    supplyAPY: 4.89,
    borrowAPY: 7.65,
    totalSupplied: 8500000,
    totalBorrowed: 5950000,
    utilizationRate: 70,
    liquidityAvailable: 2550000,
    minimumAmount: 0.01
  },
  {
    tokenId: 'yrt-usdt',
    token: MOCK_TOKENS.find(t => t.id === 'yrt-usdt')!,
    supplyAPY: 4.65,
    borrowAPY: 6.95,
    totalSupplied: 6250000,
    totalBorrowed: 4375000,
    utilizationRate: 70,
    liquidityAvailable: 1875000,
    minimumAmount: 100
  },
  {
    tokenId: 'yrt-usdc',
    token: MOCK_TOKENS.find(t => t.id === 'yrt-usdc')!,
    supplyAPY: 4.58,
    borrowAPY: 6.85,
    totalSupplied: 7800000,
    totalBorrowed: 5460000,
    utilizationRate: 70,
    liquidityAvailable: 2340000,
    minimumAmount: 100
  },
  {
    tokenId: 'yrt-base',
    token: MOCK_TOKENS.find(t => t.id === 'yrt-base')!,
    supplyAPY: 6.25,
    borrowAPY: 9.15,
    totalSupplied: 1200000,
    totalBorrowed: 840000,
    utilizationRate: 70,
    liquidityAvailable: 360000,
    minimumAmount: 10
  }
];

// Mock Liquidity Pools
export const MOCK_LIQUIDITY_POOLS: LiquidityPool[] = [
  {
    id: 'eth-usdc',
    token0: MOCK_TOKENS.find(t => t.id === 'eth')!,
    token1: MOCK_TOKENS.find(t => t.id === 'usdc')!,
    token0Reserve: 15000,
    token1Reserve: 30685000,
    totalLiquidity: 61370000,
    apy: 12.45,
    fee: 0.3,
    volume24h: 2450000
  },
  {
    id: 'usdc-dai',
    token0: MOCK_TOKENS.find(t => t.id === 'usdc')!,
    token1: MOCK_TOKENS.find(t => t.id === 'dai')!,
    token0Reserve: 5000000,
    token1Reserve: 5005000,
    totalLiquidity: 10005000,
    apy: 8.75,
    fee: 0.05,
    volume24h: 850000
  },
  {
    id: 'hotel-rwa-1-usdc',
    token0: MOCK_TOKENS.find(t => t.id === 'hotel-rwa-1')!,
    token1: MOCK_TOKENS.find(t => t.id === 'usdc')!,
    token0Reserve: 12000,
    token1Reserve: 1506000,
    totalLiquidity: 3012000,
    apy: 18.25,
    fee: 1.0,
    volume24h: 125000
  }
];

// Mock Cashflow Records
export const MOCK_CASHFLOW_RECORDS: CashflowRecord[] = [
  {
    id: 'cf-1',
    rwaTokenId: 'hotel-rwa-1',
    rwaToken: MOCK_TOKENS.find(t => t.id === 'hotel-rwa-1')!,
    amount: 45.67,
    currency: 'USD',
    date: new Date('2025-09-15'),
    type: 'rental',
    propertyId: 'prop-001',
    accumulatedTotal: 567.89
  },
  {
    id: 'cf-2',
    rwaTokenId: 'hotel-rwa-1',
    rwaToken: MOCK_TOKENS.find(t => t.id === 'hotel-rwa-1')!,
    amount: 52.34,
    currency: 'USD',
    date: new Date('2025-08-15'),
    type: 'rental',
    propertyId: 'prop-001',
    accumulatedTotal: 522.22
  },
  {
    id: 'cf-3',
    rwaTokenId: 'hotel-rwa-2',
    rwaToken: MOCK_TOKENS.find(t => t.id === 'hotel-rwa-2')!,
    amount: 38.91,
    currency: 'USD',
    date: new Date('2025-09-10'),
    type: 'rental',
    propertyId: 'prop-002',
    accumulatedTotal: 423.45
  },
  {
    id: 'cf-4',
    rwaTokenId: 'hotel-rwa-3',
    rwaToken: MOCK_TOKENS.find(t => t.id === 'hotel-rwa-3')!,
    amount: 67.89,
    currency: 'USD',
    date: new Date('2025-09-05'),
    type: 'dividend',
    propertyId: 'prop-003',
    accumulatedTotal: 734.12
  }
];

// Mock Governance Proposals
export const MOCK_GOVERNANCE_PROPOSALS: GovernanceProposal[] = [
  {
    id: 'prop-1',
    title: 'Increase Staking Rewards for RWA Tokens',
    description: 'This proposal aims to increase staking rewards for RWA token holders to incentivize long-term holding and participation in the ecosystem.',
    proposer: '0x1234...5678',
    status: 'active',
    votesFor: 125000,
    votesAgainst: 45000,
    quorum: 100000,
    endDate: new Date('2025-10-15')
  },
  {
    id: 'prop-2',
    title: 'Add New Hotel Property to Portfolio',
    description: 'Proposal to add a luxury hotel property in Miami to the RWA token portfolio, expanding our real estate holdings.',
    proposer: '0xabcd...efgh',
    status: 'passed',
    votesFor: 180000,
    votesAgainst: 32000,
    quorum: 100000,
    endDate: new Date('2025-09-01'),
    executionDate: new Date('2025-09-05')
  },
  {
    id: 'prop-3',
    title: 'Update Protocol Fee Structure',
    description: 'Proposal to modify the protocol fee structure to better align incentives and improve platform sustainability.',
    proposer: '0x9876...5432',
    status: 'failed',
    votesFor: 67000,
    votesAgainst: 145000,
    quorum: 100000,
    endDate: new Date('2025-08-20')
  }
];

// Helper function to get token by ID
export const getTokenById = (id: string): Token | undefined => {
  return MOCK_TOKENS.find(token => token.id === id);
};

// Helper function to get tokens by type
export const getTokensByType = (type: 'crypto' | 'stablecoin' | 'rwa'): Token[] => {
  return MOCK_TOKENS.filter(token => token.type === type);
};

// Helper function to generate random price movements
export const generatePriceUpdate = (basePrice: number): number => {
  const change = (Math.random() - 0.5) * 0.1; // ±5% max change
  return Math.max(basePrice * (1 + change), 0.01);
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Helper function to format percentage
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

// Helper function to format large numbers
export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
};