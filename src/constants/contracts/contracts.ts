export const CONTRACTS = {
  // YRT Token Factory (v1.0 - Slug System & Hybrid Roles)
  YRT_FACTORY: process.env.NEXT_PUBLIC_YRT_FACTORY_ADDRESS as `0x${string}`,
  AUTO_DISTRIBUTOR: process.env.NEXT_PUBLIC_AUTO_DISTRIBUTOR_ADDRESS as `0x${string}`,

  // Trading Markets (v1.0 - Property Owner Features)
  // DEX Router is the interface to access DEX Factory and all pools
  DEX_ROUTER: process.env.NEXT_PUBLIC_DEX_ROUTER_ADDRESS as `0x${string}`,
  DEX_FACTORY: process.env.NEXT_PUBLIC_DEX_FACTORY_ADDRESS as `0x${string}`,
  SECONDARY_MARKET: process.env.NEXT_PUBLIC_SECONDARY_MARKET_ADDRESS as `0x${string}`,

  // Mock Stablecoins (Testnet)
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
  IDRX: process.env.NEXT_PUBLIC_IDRX_ADDRESS as `0x${string}`,
} as const

// DEX Factory discovery through DEX Router
export const DEX_ROUTER = CONTRACTS.DEX_ROUTER;

// Legacy support for backward compatibility
export const LEGACY_CONTRACTS = {
  FACTORY: CONTRACTS.YRT_FACTORY,
  DISTRIBUTOR: CONTRACTS.AUTO_DISTRIBUTOR,
  DEX: CONTRACTS.DEX_ROUTER, // Legacy: This is actually DEX Router
} as const
