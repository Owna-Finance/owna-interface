import { SectionContainer } from '@/components/layout/section-container'
import { StickyScroll } from '@/components/ui/sticky-scroll-reveal'
import { ProcessSectionProps } from '@/types/landing-page'

export function ProcessSection({
  title,
  description,
  steps,
  className
}: ProcessSectionProps) {
  // Transform steps data to match StickyScroll content format
  const stickyScrollContent = steps.map((step) => {
    const IconComponent = step.icon
    
    return {
      title: step.title,
      description: step.description,
      content: (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6">
            <IconComponent 
              className="w-8 h-8 text-white"
              role="img" 
              aria-hidden="true"
            />
          </div>
          
          <div className="w-10 h-10 rounded-md flex items-center justify-center mb-6">
            <span className="text-lg font-medium text-white">
              {step.stepNumber}
            </span>
          </div>
          
          {step.duration && (
            <div className="text-white/80 text-sm font-medium px-3 py-1 rounded-full">
              {step.duration}
            </div>
          )}
        </div>
      )
    }
  })

  return (
    <SectionContainer background="dark" className={className}>
      <div className="text-center max-w-5xl mx-auto mb-12">
        <div className="mb-6">
          <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">How it works</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
          {title}
        </h2>
        
        <p className="text-xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <StickyScroll 
          content={stickyScrollContent}
          contentClassName="shadow-lg"
        />
      </div>
    </SectionContainer>
  )
}