import { SectionContainerProps } from '@/types/landing-page'
import { cn } from '@/lib/utils'

const backgroundStyles = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-black text-white'
}

const paddingStyles = {
  sm: 'py-12 px-4',
  md: 'py-16 px-6',
  lg: 'py-20 px-8',
  xl: 'py-24 px-12'
}

export function SectionContainer({
  children,
  id,
  className,
  background = 'white',
  padding = 'lg'
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full',
        backgroundStyles[background],
        paddingStyles[padding],
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}