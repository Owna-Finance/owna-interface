export const CONTRACTS = {
  FACTORY: process.env.NEXT_PUBLIC_YRT_FACTORY_ADDRESS as `0x${string}`,
  DISTRIBUTOR: process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS as `0x${string}`,
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
  IDRX: process.env.NEXT_PUBLIC_IDRX_ADDRESS as `0x${string}`,
  DEX: process.env.NEXT_PUBLIC_DEX_ADDRESS as `0x${string}`,
} as const
