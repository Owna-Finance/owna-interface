import { SectionContainer } from '@/components/layout/section-container'
import { ProcessSectionProps } from '@/types/landing-page'
import { cn } from '@/lib/utils'

export function ProcessSection({
  title,
  description,
  steps,
  className
}: ProcessSectionProps) {
  return (
    <SectionContainer background="light" className={className}>
      <div className="text-center max-w-5xl mx-auto mb-20">
        <div className="mb-6">
          <span className="text-sm text-gray-500 uppercase tracking-wider font-medium">How it works</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-8 leading-tight">
          {title}
        </h2>
        
        <p className="text-xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {steps.map((step, index) => {
          const IconComponent = step.icon

          return (
            <div key={step.id} className="text-center group">
              <div className="mb-8">
                <div className="w-24 h-24 border border-black/20 rounded-none flex items-center justify-center mx-auto mb-6 group-hover:border-black transition-colors duration-300">
                  <IconComponent 
                    className="w-12 h-12 text-black/70 group-hover:text-black transition-colors duration-300"
                    role="img" 
                    aria-hidden="true"
                  />
                </div>
                
                <div className="w-8 h-8 border border-black/30 rounded-none flex items-center justify-center mx-auto mb-8">
                  <span className="text-lg font-medium text-black">
                    {step.stepNumber}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-light text-black leading-tight">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed font-light">
                  {step.description}
                </p>
                
                {step.duration && (
                  <div className="text-sm text-gray-500 font-medium tracking-wide pt-2">
                    {step.duration}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SectionContainer>
  )
}