'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { VideoBackground } from '@/components/video/video-background'
import { HeroSectionProps, VideoState } from '@/types/landing-page'
import { cn } from '@/lib/utils'
import { trackCTAClick } from '@/lib/analytics'
import { useLandingPageStore } from '@/stores/landing-page-store'

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundVideo,
  className
}: HeroSectionProps) {
  const { 
    video, 
    setVideoState, 
    markVideoAsLoaded 
  } = useLandingPageStore()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Skip loading state if video has loaded once before
    if (video.hasLoadedOnce) {
      setVideoState({ state: 'playing' })
    }
  }, [video.hasLoadedOnce, setVideoState])

  const handleVideoStateChange = (state: VideoState) => {
    setVideoState({ state })
    if (state === 'playing' && !video.hasLoadedOnce) {
      markVideoAsLoaded()
    }
  }

  const navItems = [
    {
      name: "Solution",
      link: "#value-proposition",
    },
    {
      name: "How it Works",
      link: "#how-it-works",
    },
    {
      name: "Mission",
      link: "#built-on-base",
    },
  ]

  const handleCTAClick = (cta: typeof primaryCTA, ctaId: string) => {
    trackCTAClick(ctaId, cta.text, cta.href)
    if (cta.onClick) {
      cta.onClick()
    }
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault()
    const targetId = link.substring(1) // Remove the # from the link
    const targetElement = document.getElementById(targetId)
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const OwnaLogo = () => (
    <a href="#" className="relative z-20 flex items-center space-x-3 px-4 py-2">
      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
        <img
          src="/Images/Logo/owna-logo.png"
          alt="Owna Logo"
          width={16}
          height={16}
        />
      </div>
      <span className="font-medium text-white text-lg">Owna</span>
    </a>
  )

  return (
    <section className={cn("relative min-h-screen flex items-center overflow-hidden hero-minimalist", className)}>
      <VideoBackground
        configuration={backgroundVideo}
        onStateChange={handleVideoStateChange}
        overlay={{ opacity: 0.4, color: 'black' }}
        priority
      />
      
      {/* Clean Minimalist Navbar - Fixed with Scroll Effect */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-6 transition-all duration-300">
        <nav className={cn(
          "rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-500 ease-in-out",
          isScrolled 
            ? "glassmorphism-navbar-scrolled" 
            : "glassmorphism-navbar"
        )}>
          {/* Logo */}
          <OwnaLogo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <a
                key={`nav-link-${idx}`}
                href={item.link}
                onClick={(e) => handleNavClick(e, item.link)}
                className="text-white/80 hover:text-white transition-colors duration-200 font-medium cursor-pointer"
              >
                {item.name}
              </a>
            ))}
          </div>
          
          {/* Action Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => handleCTAClick(primaryCTA, 'nav-cta')}
              className="bg-white text-black px-6 py-2 rounded-xl font-medium hover:bg-white/90 transition-colors duration-200"
            >
              Launch app
            </button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={cn(
            "md:hidden mt-2 rounded-2xl px-6 py-4 transition-all duration-500 ease-in-out",
            isScrolled 
              ? "glassmorphism-navbar-scrolled" 
              : "glassmorphism-navbar"
          )}>
            <div className="flex flex-col space-y-4">
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-nav-link-${idx}`}
                  href={item.link}
                  onClick={(e) => {
                    handleNavClick(e, item.link)
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-white/80 hover:text-white transition-colors duration-200 font-medium cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  handleCTAClick(primaryCTA, 'mobile-nav-cta')
                  setIsMobileMenuOpen(false)
                }}
                className="bg-white text-black px-6 py-2 rounded-xl font-medium hover:bg-white/90 transition-colors duration-200 text-left"
              >
                Launch app
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl pt-20">
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-light text-white leading-tight mb-6 hero-text-shadow">
            {title}
          </h1>
          
          <p className="text-lg text-white/90 mb-8 leading-relaxed font-light max-w-lg hero-text-shadow">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 px-8 py-3 text-sm font-medium rounded-none btn-minimal"
              disabled={primaryCTA.disabled}
            >
              <a
                href={primaryCTA.href}
                onClick={() => handleCTAClick(primaryCTA, 'hero-primary')}
                aria-busy={primaryCTA.loading}
              >
                {primaryCTA.loading ? 'Loading...' : primaryCTA.text}
              </a>
            </Button>
            
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 px-8 py-3 text-sm font-medium rounded-none border border-white/30 btn-minimal"
              disabled={secondaryCTA.disabled}
            >
              <a
                href={secondaryCTA.href}
                onClick={() => handleCTAClick(secondaryCTA, 'hero-secondary')}
                aria-busy={secondaryCTA.loading}
                aria-disabled={secondaryCTA.disabled}
              >
                {secondaryCTA.loading ? 'Loading...' : secondaryCTA.text}
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
      
      {video.state === 'loading' && !video.hasLoadedOnce && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-5">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </section>
  )
}