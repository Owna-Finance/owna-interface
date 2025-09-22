import { SectionContainer } from '@/components/layout/section-container'
import { SocialProofProps } from '@/types/landing-page'
import { cn } from '@/lib/utils'

export function SocialProof({
  title,
  statistics,
  trustIndicators,
  className
}: SocialProofProps) {
  return (
    <SectionContainer background="dark" className={className}>
      <div className="text-center mb-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full mx-2"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-20 leading-tight">
          {title}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {statistics.map((stat) => (
            <div key={stat.id} className="text-center group">
              <div className="text-5xl lg:text-6xl font-light text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-xl font-light text-white/80 mb-2">
                {stat.label}
              </div>
              {stat.description && (
                <div className="text-sm text-white/60 font-light">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {trustIndicators.map((indicator) => {
            const IconComponent = indicator.icon

            return (
              <div key={indicator.id} className="text-center group">
                <div className="space-y-6">
                  <div className="w-20 h-20 border border-white/20 rounded-none flex items-center justify-center mx-auto group-hover:border-cyan-400 transition-colors duration-300">
                    <IconComponent 
                      className="w-10 h-10 text-white/70 group-hover:text-cyan-400 transition-colors duration-300"
                      role="img"
                      aria-hidden="true"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-light text-white">
                    {indicator.title}
                  </h3>
                  
                  <p className="text-white/60 leading-relaxed font-light">
                    {indicator.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SectionContainer>
  )
}