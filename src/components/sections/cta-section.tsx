'use client'

import { Button } from '@/components/ui/button'
import { SectionContainer } from '@/components/layout/section-container'
import { CTASectionProps } from '@/types/landing-page'
import { cn } from '@/lib/utils'
import { trackCTAClick } from '@/lib/analytics'

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  urgency,
  className
}: CTASectionProps) {
  const handleCTAClick = (cta: typeof primaryCTA, ctaId: string) => {
    trackCTAClick(ctaId, cta.text, cta.href)
    if (cta.onClick) {
      cta.onClick()
    }
  }

  return (
    <SectionContainer background="dark" className={className}>
      <div className="text-center max-w-5xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full mx-2"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
            {title}
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
            {description}
          </p>
          
          {urgency && (
            <div className={cn(
              "inline-block px-6 py-3 mt-8 border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 rounded-none",
              urgency.emphasized && "font-medium animate-pulse"
            )}>
              {urgency.text}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-12 py-4 text-lg font-medium min-w-[240px] rounded-none btn-minimal"
            disabled={primaryCTA.disabled}
          >
            <a
              href={primaryCTA.href}
              onClick={() => handleCTAClick(primaryCTA, 'final-primary')}
              aria-busy={primaryCTA.loading}
            >
              {primaryCTA.loading ? 'Loading...' : primaryCTA.text}
            </a>
          </Button>
          
          {secondaryCTA && (
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 px-12 py-4 text-lg font-medium min-w-[240px] rounded-none border border-white/30 btn-minimal"
              disabled={secondaryCTA.disabled}
            >
              <a
                href={secondaryCTA.href}
                onClick={() => handleCTAClick(secondaryCTA, 'final-secondary')}
                aria-busy={secondaryCTA.loading}
                aria-disabled={secondaryCTA.disabled}
              >
                {secondaryCTA.loading ? 'Loading...' : secondaryCTA.text}
              </a>
            </Button>
          )}
        </div>
      </div>
    </SectionContainer>
  )
}