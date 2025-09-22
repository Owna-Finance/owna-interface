import { LucideIcon } from 'lucide-react'

export type VideoState = 'loading' | 'playing' | 'paused' | 'error'
export type CTAVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type GridLayout = 'grid-2' | 'grid-3' | 'grid-4'

export interface VideoConfiguration {
  sources: Array<{
    src: string
    media?: string
    type: string
  }>
  poster: string
  playbackSettings: {
    autoplay: boolean
    muted: boolean
    loop: boolean
    playsInline: boolean
    preload: 'none' | 'metadata' | 'auto'
  }
  loadingStrategy: {
    lazy: boolean
    intersectionThreshold: number
  }
  qualityOptions: {
    mobile: string
    tablet: string
    desktop: string
  }
}

export interface CTAButton {
  text: string
  href: string
  variant: CTAVariant
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export interface FeatureItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  metric?: string
  highlighted?: boolean
}

export interface ProcessStep {
  id: string
  stepNumber: number
  title: string
  description: string
  icon: LucideIcon
  duration?: string
}

export interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  primaryCTA: CTAButton
  secondaryCTA: CTAButton
  backgroundVideo: VideoConfiguration
  className?: string
}

export interface VideoBackgroundProps {
  configuration: VideoConfiguration
  onStateChange: (state: VideoState) => void
  className?: string
  overlay?: {
    opacity: number
    color: string
  }
  priority?: boolean
}

export interface FeatureGridProps {
  title: string
  subtitle?: string
  description?: string
  features: FeatureItem[]
  layout: GridLayout
  className?: string
}

export interface ProcessSectionProps {
  title: string
  description: string
  steps: ProcessStep[]
  className?: string
}

export interface ValuePropositionProps {
  title: string
  subtitle?: string
  problemStatement: string
  solutionStatement: string
  keyDifferentiator: string
  supportingMetrics?: Array<{
    label: string
    value: string
    description?: string
  }>
  className?: string
}

export interface SocialProofProps {
  title: string
  statistics: Array<{
    id: string
    value: string
    label: string
    description?: string
  }>
  trustIndicators: Array<{
    id: string
    icon: LucideIcon
    title: string
    description: string
  }>
  className?: string
}

export interface CTASectionProps {
  title: string
  description: string
  primaryCTA: CTAButton
  secondaryCTA?: CTAButton
  urgency?: {
    text: string
    emphasized: boolean
  }
  className?: string
}

export interface LandingPageLayoutProps {
  children: React.ReactNode
  className?: string
}

export interface SectionContainerProps {
  children: React.ReactNode
  id?: string
  className?: string
  background?: 'white' | 'gray' | 'dark'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface VideoStateData {
  state: VideoState
  currentTime: number
  duration: number
  volume: number
  muted: boolean
  error?: string
  hasLoadedOnce: boolean
}

export interface UIState {
  currentSection: string
  scrollProgress: number
  isMenuOpen: boolean
  reducedMotion: boolean
}

export interface AnalyticsState {
  scrollDepth: number
  timeOnPage: number
  ctaClicks: Record<string, number>
  sectionViews: Record<string, number>
  videoInteractions: number
}

export interface LandingPageStore {
  video: VideoStateData
  ui: UIState
  analytics: AnalyticsState
  
  setVideoState: (state: Partial<VideoStateData>) => void
  updateScrollProgress: (progress: number) => void
  setCurrentSection: (sectionId: string) => void
  trackCTAClick: (ctaId: string) => void
  trackSectionView: (sectionId: string) => void
  toggleMenu: () => void
  setReducedMotion: (enabled: boolean) => void
  markVideoAsLoaded: () => void
}

export interface LandingPageContent {
  hero: {
    title: string
    subtitle: string
    description: string
    primaryCTA: Omit<CTAButton, 'onClick'>
    secondaryCTA: Omit<CTAButton, 'onClick'>
  }
  
  valueProposition: {
    title: string
    subtitle?: string
    problemStatement: string
    solutionStatement: string
    keyDifferentiator: string
    metrics: Array<{
      label: string
      value: string
      description?: string
    }>
  }
  
  process: {
    title: string
    description: string
    steps: ProcessStep[]
  }
  
  finalCTA: {
    title: string
    description: string
    primaryCTA: Omit<CTAButton, 'onClick'>
    secondaryCTA?: Omit<CTAButton, 'onClick'>
    urgency?: {
      text: string
      emphasized: boolean
    }
  }
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export interface PerformanceMetrics {
  videoLoadTime: number
  pageInteractive: number
  firstContentfulPaint: number
  cumulativeLayoutShift: number
  largestContentfulPaint: number
}