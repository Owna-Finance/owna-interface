import { SectionContainer } from '@/components/layout/section-container'
import { FeatureGridProps } from '@/types/landing-page'
import { cn } from '@/lib/utils'

const gridLayoutStyles = {
  'grid-2': 'grid-cols-1 md:grid-cols-2',
  'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'grid-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}

export function FeatureGrid({
  title,
  subtitle,
  description,
  features,
  layout,
  className
}: FeatureGridProps) {
  return (
    <SectionContainer background="gray" className={className}>
      <div className="text-center max-w-5xl mx-auto mb-20">
        <div className="mb-6">
          <span className="text-sm text-gray-500 uppercase tracking-wider font-medium">Features</span>
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-black mb-8 leading-tight">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-xl font-light text-gray-600 mb-6 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className={cn(
        'grid gap-12',
        gridLayoutStyles[layout]
      )}>
        {features.map((feature, index) => {
          const IconComponent = feature.icon

          return (
            <div 
              key={feature.id} 
              className={cn(
                'group transition-all duration-300',
                feature.highlighted && 'relative'
              )}
            >
              {feature.highlighted && (
                <div className="absolute -inset-4 border border-black/10 rounded-none"></div>
              )}
              
              <div className="space-y-6 p-8">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 border border-black/20 rounded-none flex items-center justify-center group-hover:border-black transition-colors duration-300">
                    <IconComponent 
                      className="w-8 h-8 text-black/70 group-hover:text-black transition-colors duration-300" 
                      role="img"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.metric && (
                    <div className="text-sm text-gray-500 font-medium tracking-wide">
                      {feature.metric}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-light text-black leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionContainer>
  )
}