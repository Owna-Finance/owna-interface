import { create } from 'zustand';
import { Portfolio, PortfolioSummary } from '@/types/portfolio';
import { Token, TokenHolding } from '@/types/token';
import { MOCK_PORTFOLIO, MOCK_TOKENS, getTokenById } from '@/data/mock-data';

interface PortfolioState {
  // State
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  
  // Actions
  loadPortfolio: () => Promise<void>;
  refreshPortfolio: () => Promise<void>;
  updateTokenBalance: (tokenId: string, balance: number) => void;
  getPortfolioSummary: () => PortfolioSummary;
  getTokenHolding: (tokenId: string) => TokenHolding | undefined;
  clearError: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: null,
  isLoading: false,
  error: null,
  lastRefresh: null,
  
  loadPortfolio: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from an API
      const portfolio: Portfolio = {
        ...MOCK_PORTFOLIO,
        lastUpdated: new Date()
      };
      
      set({ 
        portfolio, 
        isLoading: false, 
        lastRefresh: new Date(),
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load portfolio',
        isLoading: false 
      });
    }
  },
  
  refreshPortfolio: async () => {
    const { portfolio } = get();
    if (!portfolio) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate price updates
      const updatedTokens = portfolio.tokens.map(holding => {
        const token = getTokenById(holding.tokenId);
        if (!token) return holding;
        
        // Simulate small price changes
        const priceChange = (Math.random() - 0.5) * 0.02; // ±1% max change
        const newPrice = token.price * (1 + priceChange);
        const newValue = holding.balance * newPrice;
        
        return {
          ...holding,
          value: newValue
        };
      });
      
      const totalBalance = updatedTokens.reduce((sum, token) => sum + token.value, 0);
      const oldTotalBalance = portfolio.totalBalance;
      const dayChange = ((totalBalance - oldTotalBalance) / oldTotalBalance) * 100;
      
      // Recalculate allocations
      const cryptoValue = updatedTokens
        .filter(h => getTokenById(h.tokenId)?.type === 'crypto')
        .reduce((sum, h) => sum + h.value, 0);
      const stablecoinValue = updatedTokens
        .filter(h => getTokenById(h.tokenId)?.type === 'stablecoin')
        .reduce((sum, h) => sum + h.value, 0);
      const rwaValue = updatedTokens
        .filter(h => getTokenById(h.tokenId)?.type === 'rwa')
        .reduce((sum, h) => sum + h.value, 0);
      
      const updatedPortfolio: Portfolio = {
        ...portfolio,
        totalBalance,
        tokens: updatedTokens,
        allocations: {
          crypto: (cryptoValue / totalBalance) * 100,
          stablecoin: (stablecoinValue / totalBalance) * 100,
          rwa: (rwaValue / totalBalance) * 100
        },
        performance: {
          ...portfolio.performance,
          daily: dayChange
        },
        lastUpdated: new Date()
      };
      
      set({ 
        portfolio: updatedPortfolio, 
        isLoading: false, 
        lastRefresh: new Date(),
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to refresh portfolio',
        isLoading: false 
      });
    }
  },
  
  updateTokenBalance: (tokenId: string, balance: number) => {
    const { portfolio } = get();
    if (!portfolio) return;
    
    const token = getTokenById(tokenId);
    if (!token) return;
    
    const updatedTokens = portfolio.tokens.map(holding => {
      if (holding.tokenId === tokenId) {
        const newValue = balance * token.price;
        return {
          ...holding,
          balance,
          value: newValue
        };
      }
      return holding;
    });
    
    const totalBalance = updatedTokens.reduce((sum, token) => sum + token.value, 0);
    
    // Recalculate allocations
    const cryptoValue = updatedTokens
      .filter(h => getTokenById(h.tokenId)?.type === 'crypto')
      .reduce((sum, h) => sum + h.value, 0);
    const stablecoinValue = updatedTokens
      .filter(h => getTokenById(h.tokenId)?.type === 'stablecoin')
      .reduce((sum, h) => sum + h.value, 0);
    const rwaValue = updatedTokens
      .filter(h => getTokenById(h.tokenId)?.type === 'rwa')
      .reduce((sum, h) => sum + h.value, 0);
    
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      totalBalance,
      tokens: updatedTokens,
      allocations: {
        crypto: totalBalance > 0 ? (cryptoValue / totalBalance) * 100 : 0,
        stablecoin: totalBalance > 0 ? (stablecoinValue / totalBalance) * 100 : 0,
        rwa: totalBalance > 0 ? (rwaValue / totalBalance) * 100 : 0
      },
      lastUpdated: new Date()
    };
    
    set({ portfolio: updatedPortfolio });
  },
  
  getPortfolioSummary: (): PortfolioSummary => {
    const { portfolio } = get();
    
    if (!portfolio) {
      return {
        totalValue: 0,
        dayChange: 0,
        dayChangePercent: 0,
        totalTokens: 0,
        topHolding: null
      };
    }
    
    const topHolding = portfolio.tokens.reduce((max, current) => 
      current.value > max.value ? current : max
    );
    
    return {
      totalValue: portfolio.totalBalance,
      dayChange: portfolio.performance.daily,
      dayChangePercent: portfolio.performance.daily,
      totalTokens: portfolio.tokens.length,
      topHolding: topHolding
    };
  },
  
  getTokenHolding: (tokenId: string): TokenHolding | undefined => {
    const { portfolio } = get();
    if (!portfolio) return undefined;
    
    return portfolio.tokens.find(holding => holding.tokenId === tokenId);
  },
  
  clearError: () => set({ error: null })
}));