export type Address = `0x${string}`;

export type CurrentStep =
  | 'idle'
  | 'approving-token-a'
  | 'token-a-approved'
  | 'approving-token-b'
  | 'tokens-approved'
  | 'adding-liquidity'
  | 'completed';

// For adding liquidity to existing pools (no pool creation)
export type AddLiquidityFormData = {
  tokenA: Address;
  tokenB: Address;
  amountADesired: string;
  amountBDesired: string;
  slippage: string;
  to: Address;
  deadline: string;
};

// For creating new pools (initial liquidity)
export type CreatePoolWithLiquidityFormData = {
  tokenA: Address;
  tokenB: Address;
  amountADesired: string;
  amountBDesired: string;
  slippage: string;
  to: Address;
  deadline: string;
  propertyName: string;
  propertyOwner: Address;
};