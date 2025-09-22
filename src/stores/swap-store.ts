import { create } from 'zustand';
import { Token } from '@/types/token';
import { SwapTransaction, SwapQuote, SwapSettings, SwapStatus } from '@/types/swap';
import { MOCK_TOKENS, getTokenById } from '@/data/mock-data';
import { generateExchangeRate, calculateSlippageAmount } from '@/lib/utils';

interface SwapState {
  // Form State
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  
  // Calculation State
  exchangeRate: number | null;
  priceImpact: number;
  minimumReceived: number;
  
  // Settings
  settings: SwapSettings;
  
  // UI State
  status: SwapStatus;
  error: string | null;
  isCalculating: boolean;
  
  // Transaction History
  transactions: SwapTransaction[];
  
  // Actions
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setFromAmount: (amount: string) => void;
  swapTokens: () => void;
  updateSettings: (settings: Partial<SwapSettings>) => void;
  calculateQuote: () => Promise<SwapQuote | null>;
  executeSwap: () => Promise<void>;
  getAvailableTokens: () => Token[];
  clearError: () => void;
  reset: () => void;
}

const initialSettings: SwapSettings = {
  slippage: 0.5, // 0.5%
  deadline: 20, // 20 minutes
  autoRouting: true
};

export const useSwapStore = create<SwapState>((set, get) => ({
  // Form State
  fromToken: null,
  toToken: null,
  fromAmount: '',
  toAmount: '',
  
  // Calculation State
  exchangeRate: null,
  priceImpact: 0,
  minimumReceived: 0,
  
  // Settings
  settings: initialSettings,
  
  // UI State
  status: 'idle',
  error: null,
  isCalculating: false,
  
  // Transaction History
  transactions: [],
  
  setFromToken: (token: Token | null) => {
    const { toToken } = get();
    
    // If setting the same token as toToken, swap them
    if (token && toToken && token.id === toToken.id) {
      set({ fromToken: toToken, toToken: token });
    } else {
      set({ fromToken: token });
    }
    
    // Recalculate if both tokens are set
    if (token && get().toToken && get().fromAmount) {
      get().calculateQuote();
    }
  },
  
  setToToken: (token: Token | null) => {
    const { fromToken } = get();
    
    // If setting the same token as fromToken, swap them
    if (token && fromToken && token.id === fromToken.id) {
      set({ toToken: fromToken, fromToken: token });
    } else {
      set({ toToken: token });
    }
    
    // Recalculate if both tokens are set
    if (token && get().fromToken && get().fromAmount) {
      get().calculateQuote();
    }
  },
  
  setFromAmount: (amount: string) => {
    set({ fromAmount: amount });
    
    // Recalculate if both tokens are set and amount is valid
    if (amount && get().fromToken && get().toToken) {
      get().calculateQuote();
    } else {
      set({ toAmount: '', exchangeRate: null });
    }
  },
  
  swapTokens: () => {
    const { fromToken, toToken, fromAmount, toAmount } = get();
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromAmount: toAmount,
      toAmount: fromAmount
    });
    
    if (fromToken && toToken && toAmount) {
      get().calculateQuote();
    }
  },
  
  updateSettings: (newSettings: Partial<SwapSettings>) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }));
    
    // Recalculate with new settings
    if (get().fromToken && get().toToken && get().fromAmount) {
      get().calculateQuote();
    }
  },
  
  calculateQuote: async (): Promise<SwapQuote | null> => {
    const { fromToken, toToken, fromAmount, settings } = get();
    
    if (!fromToken || !toToken || !fromAmount || isNaN(parseFloat(fromAmount))) {
      set({ toAmount: '', exchangeRate: null, minimumReceived: 0 });
      return null;
    }
    
    set({ isCalculating: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const fromAmountNum = parseFloat(fromAmount);
      const exchangeRate = generateExchangeRate(fromToken.price, toToken.price);
      const toAmountNum = fromAmountNum * exchangeRate;
      
      // Calculate price impact (simplified)
      const priceImpact = Math.min(fromAmountNum / 100000 * 0.1, 5); // Max 5% impact
      const adjustedToAmount = toAmountNum * (1 - priceImpact / 100);
      
      // Calculate minimum received with slippage
      const minimumReceived = calculateSlippageAmount(adjustedToAmount, settings.slippage);
      
      const quote: SwapQuote = {
        fromToken,
        toToken,
        fromAmount: fromAmountNum,
        toAmount: adjustedToAmount,
        exchangeRate,
        priceImpact,
        minimumReceived,
        fee: fromAmountNum * 0.003, // 0.3% fee
        route: [{
          tokenIn: fromToken,
          tokenOut: toToken,
          percentage: 100,
          pool: `${fromToken.symbol}-${toToken.symbol}`
        }]
      };
      
      set({
        toAmount: adjustedToAmount.toFixed(6),
        exchangeRate,
        priceImpact,
        minimumReceived,
        isCalculating: false
      });
      
      return quote;
    } catch (error) {
      set({
        error: 'Failed to calculate quote',
        isCalculating: false
      });
      return null;
    }
  },
  
  executeSwap: async () => {
    const { fromToken, toToken, fromAmount, toAmount, exchangeRate } = get();
    
    if (!fromToken || !toToken || !fromAmount || !toAmount || !exchangeRate) {
      set({ error: 'Invalid swap parameters' });
      return;
    }
    
    set({ status: 'loading', error: null });
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transaction: SwapTransaction = {
        id: `swap-${Date.now()}`,
        fromToken,
        toToken,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
        exchangeRate,
        slippage: get().settings.slippage,
        status: 'completed',
        timestamp: new Date()
      };
      
      set(state => ({
        transactions: [transaction, ...state.transactions],
        status: 'success',
        fromAmount: '',
        toAmount: '',
        exchangeRate: null
      }));
      
      // Reset status after 3 seconds
      setTimeout(() => {
        set({ status: 'idle' });
      }, 3000);
      
    } catch (error) {
      set({
        status: 'error',
        error: 'Transaction failed'
      });
    }
  },
  
  getAvailableTokens: (): Token[] => {
    return MOCK_TOKENS;
  },
  
  clearError: () => set({ error: null }),
  
  reset: () => set({
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
    exchangeRate: null,
    priceImpact: 0,
    minimumReceived: 0,
    status: 'idle',
    error: null,
    isCalculating: false
  })
}));