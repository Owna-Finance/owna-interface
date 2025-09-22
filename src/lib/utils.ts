import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVideoQualityForDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function shouldLoadVideo(): boolean {
  if (typeof window === 'undefined') return false
  
  const connection = (navigator as any).connection
  if (connection) {
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return false
    }
    if (connection.saveData) {
      return false
    }
  }
  
  return true
}

export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  threshold: number = 0.1
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null
  }
  
  return new IntersectionObserver(callback, {
    threshold,
    rootMargin: '50px 0px',
  })
}

export function formatMetric(value: string | number): string {
  if (typeof value === 'string') return value
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  return Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100)
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function generateVideoSources(basePath: string) {
  return [
    {
      src: `${basePath}-mobile.mp4`,
      media: '(max-width: 768px)',
      type: 'video/mp4'
    },
    {
      src: `${basePath}-tablet.mp4`, 
      media: '(max-width: 1024px)',
      type: 'video/mp4'
    },
    {
      src: `${basePath}.mp4`,
      type: 'video/mp4'
    }
  ]
}

// Dashboard-specific utility functions
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number, decimals = 2, showSign = true): string {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatLargeNumber(num: number, decimals = 1): string {
  const absNum = Math.abs(num);
  if (absNum >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (absNum >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (absNum >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toFixed(2);
}

export function formatTokenAmount(amount: number, decimals: number = 18, displayDecimals: number = 6): string {
  const actualAmount = amount / Math.pow(10, decimals);
  if (actualAmount === 0) return '0';
  if (actualAmount < 0.000001) return '< 0.000001';
  return actualAmount.toFixed(Math.min(displayDecimals, 8));
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getChangeColorClass(value: number): string {
  if (value > 0) return 'metric-positive';
  if (value < 0) return 'metric-negative';
  return 'metric-neutral';
}

export function getChangeIcon(value: number): '↗' | '↘' | '→' {
  if (value > 0) return '↗';
  if (value < 0) return '↘';
  return '→';
}

export function truncateAddress(address: string, startChars = 6, endChars = 4): string {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

export function generateExchangeRate(fromPrice: number, toPrice: number): number {
  return fromPrice / toPrice;
}

export function calculateSlippageAmount(amount: number, slippage: number): number {
  return amount * (1 - slippage / 100);
}

export function validateTokenAmount(amount: string, maxAmount?: number): { isValid: boolean; error?: string } {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  if (maxAmount && numAmount > maxAmount) {
    return { isValid: false, error: 'Insufficient balance' };
  }
  
  return { isValid: true };
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
