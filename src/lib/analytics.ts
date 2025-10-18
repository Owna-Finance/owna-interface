'use client'

import { useLandingPageStore } from '@/stores/landing-page-store'

export function trackCTAClick(ctaId: string, ctaText: string, href: string) {
  const store = useLandingPageStore.getState()
  
  store.trackCTAClick(ctaId)
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: ctaText,
      value: ctaId,
      custom_parameters: {
        href,
        section: store.ui.currentSection,
        scroll_progress: store.ui.scrollProgress
      }
    })
  }
}

export function trackSectionView(sectionId: string) {
  const store = useLandingPageStore.getState()
  
  store.trackSectionView(sectionId)
  store.setCurrentSection(sectionId)
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'section_view', {
      event_category: 'engagement',
      event_label: sectionId,
      custom_parameters: {
        scroll_progress: store.ui.scrollProgress,
        time_on_page: store.analytics.timeOnPage
      }
    })
  }
}

export function trackVideoInteraction(action: 'play' | 'pause' | 'error' | 'loaded') {
  const store = useLandingPageStore.getState()
  
  const currentInteractions = store.analytics.videoInteractions + 1
  
  store.setVideoState({ 
    state: action === 'loaded' ? 'playing' : action === 'error' ? 'error' : action === 'play' ? 'playing' : 'paused'
  })
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_interaction', {
      event_category: 'engagement',
      event_label: action,
      custom_parameters: {
        interaction_count: currentInteractions,
        section: store.ui.currentSection
      }
    })
  }
}

export function initializePageTracking() {
  if (typeof window === 'undefined') return
  
  const store = useLandingPageStore.getState()
  const startTime = performance.now()
  
  const updateTimeOnPage = () => {
    const timeOnPage = (performance.now() - startTime) / 1000
    store.analytics.timeOnPage = timeOnPage
  }
  
  const handleScroll = () => {
    const scrollProgress = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    )
    store.updateScrollProgress(Math.min(scrollProgress, 100))
  }
  
  const handleVisibilityChange = () => {
    if (document.hidden) {
      updateTimeOnPage()
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('beforeunload', updateTimeOnPage)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  setInterval(updateTimeOnPage, 5000)
  
  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('beforeunload', updateTimeOnPage)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void
  }
}