// Fallback addresses for development (Base Sepolia)
const FALLBACK_ADDRESSES = {
  YRT_FACTORY: '0x7FbFb4499c6d8ec01B904424b7bb963c23B44568',
  AUTO_DISTRIBUTOR: '0xD4E0FD53740e6E3DE699A388B80445CC4a67C0cE',
  DEX_ROUTER: '0x7C35348f8f249739e1ea5A1Ec7B6Ea2e15CBccD6',
  DEX_FACTORY: '0x1dC1CE24d956951a078aE0Dd61379A86c901E773',
  SECONDARY_MARKET: '0x9ED36dd97796bA008677474b8920eba1649e1a91',
  USDC: '0xBBEc8387f9b699127587dfeC39ff998B3331B78C',
  IDRX: '0x5FcbfC26a8aD45daCb312ae195b573A34E546D1d',
} as const;

export const CONTRACTS = {
  // YRT Token Factory (v1.0 - Slug System & Hybrid Roles)
  YRT_FACTORY: (process.env.NEXT_PUBLIC_YRT_FACTORY_ADDRESS || FALLBACK_ADDRESSES.YRT_FACTORY) as `0x${string}`,
  AUTO_DISTRIBUTOR: (process.env.NEXT_PUBLIC_AUTO_DISTRIBUTOR_ADDRESS || FALLBACK_ADDRESSES.AUTO_DISTRIBUTOR) as `0x${string}`,

  // Trading Markets (v1.0 - Property Owner Features)
  // DEX Router is the interface to access DEX Factory and all pools
  DEX_ROUTER: (process.env.NEXT_PUBLIC_DEX_ROUTER_ADDRESS || FALLBACK_ADDRESSES.DEX_ROUTER) as `0x${string}`,
  DEX_FACTORY: (process.env.NEXT_PUBLIC_DEX_FACTORY_ADDRESS || FALLBACK_ADDRESSES.DEX_FACTORY) as `0x${string}`,
  SECONDARY_MARKET: (process.env.NEXT_PUBLIC_SECONDARY_MARKET_ADDRESS || FALLBACK_ADDRESSES.SECONDARY_MARKET) as `0x${string}`,

  // Mock Stablecoins (Testnet - 18 decimals)
  USDC: (process.env.NEXT_PUBLIC_USDC_ADDRESS || FALLBACK_ADDRESSES.USDC) as `0x${string}`,
  IDRX: (process.env.NEXT_PUBLIC_IDRX_ADDRESS || FALLBACK_ADDRESSES.IDRX) as `0x${string}`,
} as const

// DEX Factory discovery through DEX Router
export const DEX_ROUTER = CONTRACTS.DEX_ROUTER;

// Legacy support for backward compatibility
export const LEGACY_CONTRACTS = {
  FACTORY: CONTRACTS.YRT_FACTORY,
  DISTRIBUTOR: CONTRACTS.AUTO_DISTRIBUTOR,
  DEX: CONTRACTS.DEX_ROUTER, // Legacy: This is actually DEX Router
} as const
