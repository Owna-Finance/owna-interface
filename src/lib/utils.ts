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
