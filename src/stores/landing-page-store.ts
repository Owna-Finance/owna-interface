import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LandingPageStore } from '@/types/landing-page'

export const useLandingPageStore = create<LandingPageStore>()(
  persist(
    (set, get) => ({
      video: {
        state: 'loading',
        currentTime: 0,
        duration: 0,
        volume: 1,
        muted: true,
        error: undefined,
        hasLoadedOnce: false,
      },
  
  ui: {
    currentSection: 'hero',
    scrollProgress: 0,
    isMenuOpen: false,
    reducedMotion: false,
  },
  
  analytics: {
    scrollDepth: 0,
    timeOnPage: 0,
    ctaClicks: {},
    sectionViews: {},
    videoInteractions: 0,
  },

  setVideoState: (state) => {
    set((prev) => ({
      video: { ...prev.video, ...state }
    }))
  },

  updateScrollProgress: (progress) => {
    set((prev) => ({
      ui: { ...prev.ui, scrollProgress: progress },
      analytics: { 
        ...prev.analytics, 
        scrollDepth: Math.max(prev.analytics.scrollDepth, progress)
      }
    }))
  },

  setCurrentSection: (sectionId) => {
    set((prev) => {
      const currentViews = prev.analytics.sectionViews[sectionId] || 0
      return {
        ui: { ...prev.ui, currentSection: sectionId },
        analytics: {
          ...prev.analytics,
          sectionViews: {
            ...prev.analytics.sectionViews,
            [sectionId]: currentViews + 1
          }
        }
      }
    })
  },

  trackCTAClick: (ctaId) => {
    set((prev) => {
      const currentClicks = prev.analytics.ctaClicks[ctaId] || 0
      return {
        analytics: {
          ...prev.analytics,
          ctaClicks: {
            ...prev.analytics.ctaClicks,
            [ctaId]: currentClicks + 1
          }
        }
      }
    })
  },

  trackSectionView: (sectionId) => {
    set((prev) => {
      const currentViews = prev.analytics.sectionViews[sectionId] || 0
      return {
        analytics: {
          ...prev.analytics,
          sectionViews: {
            ...prev.analytics.sectionViews,
            [sectionId]: currentViews + 1
          }
        }
      }
    })
  },

  toggleMenu: () => {
    set((prev) => ({
      ui: { ...prev.ui, isMenuOpen: !prev.ui.isMenuOpen }
    }))
  },

  setReducedMotion: (enabled) => {
    set((prev) => ({
      ui: { ...prev.ui, reducedMotion: enabled }
    }))
  },

  markVideoAsLoaded: () => {
    set((prev) => ({
      video: { 
        ...prev.video, 
        hasLoadedOnce: true,
        state: 'playing'
      }
    }))
  },
}),
    {
      name: 'owna-landing-storage',
      partialize: (state) => ({
        video: {
          hasLoadedOnce: state.video.hasLoadedOnce,
        }
      })
    }
  )
)