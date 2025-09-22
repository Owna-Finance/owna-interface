import { SectionContainer } from '@/components/layout/section-container'
import { WobbleCard } from '@/components/ui/wobble-card'
import { ValuePropositionProps } from '@/types/landing-page'
import { cn } from '@/lib/utils'

export function ValueProposition({
  title,
  subtitle,
  problemStatement,
  solutionStatement,
  keyDifferentiator,
  supportingMetrics,
  className
}: ValuePropositionProps) {
  return (
    <SectionContainer background="dark" className={className}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-8 leading-tight max-w-4xl mx-auto">
            <span className="font-light">Traditional Real Estate, </span>
            <span className="font-bold">Reimagined</span>
          </h2>
          
          {subtitle && (
            <p className="text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* WobbleCard Grid Layout */}
        <div className="space-y-6">
          {/* Top Row - 2 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Challenge Card */}
            <WobbleCard containerClassName="bg-black border border-white/10 h-[320px] lg:h-[360px]">
              <div className="relative z-10">
                <div className="w-12 h-1 bg-white mb-6"></div>
                <h3 className="text-2xl font-light text-white mb-6">Current Challenge</h3>
                <p className="text-white/80 leading-relaxed font-light text-base">
                  {problemStatement}
                </p>
              </div>
            </WobbleCard>

            {/* Owna Solution Card */}
            <WobbleCard containerClassName="bg-black border border-white/10 h-[320px] lg:h-[360px]">
              <div className="relative z-10">
                <div className="w-12 h-1 bg-white mb-6"></div>
                <h3 className="text-2xl font-light text-white mb-6">Owna Solution</h3>
                <p className="text-white/80 leading-relaxed font-light text-base">
                  {solutionStatement}
                </p>
              </div>
            </WobbleCard>
          </div>

          {/* Bottom Row - Full Width Card */}
          <div>
            {/* Key Advantage Card - Full Width */}
            <WobbleCard containerClassName="bg-black border border-cyan-400/20 h-[280px] lg:h-[320px]">
              <div className="relative z-10">
                <div className="w-12 h-1 bg-white mb-8"></div>
                <h3 className="text-3xl font-light text-white mb-8">Key Advantage</h3>
                <p className="text-white/90 leading-relaxed font-light text-lg max-w-5xl">
                  {keyDifferentiator}
                </p>
              </div>
            </WobbleCard>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}