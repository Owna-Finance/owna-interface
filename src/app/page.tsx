import { HeroSection } from '@/components/sections/hero-section'
import { ValueProposition } from '@/components/sections/value-proposition'
import { ProcessSection } from '@/components/sections/process-section'
import { BaseSection } from '@/components/sections/base-section'
import { CTASection } from '@/components/sections/cta-section'
import { Footer } from '@/components/layout/footer'
import { landingPageContent, videoConfiguration } from '@/data/landing-content'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection
        title={landingPageContent.hero.title}
        subtitle={landingPageContent.hero.subtitle}
        description={landingPageContent.hero.description}
        primaryCTA={landingPageContent.hero.primaryCTA}
        secondaryCTA={landingPageContent.hero.secondaryCTA}
        backgroundVideo={videoConfiguration}
      />

      <section id="value-proposition">
        <ValueProposition
          title={landingPageContent.valueProposition.title}
          subtitle={landingPageContent.valueProposition.subtitle}
          problemStatement={landingPageContent.valueProposition.problemStatement}
          solutionStatement={landingPageContent.valueProposition.solutionStatement}
          keyDifferentiator={landingPageContent.valueProposition.keyDifferentiator}
          supportingMetrics={landingPageContent.valueProposition.metrics}
        />
      </section>

      <section id="how-it-works">
        <ProcessSection
          title={landingPageContent.process.title}
          description={landingPageContent.process.description}
          steps={landingPageContent.process.steps}
        />
      </section>

      <section id="built-on-base">
        <BaseSection />
      </section>

      <section id="get-started">
        <CTASection
          title={landingPageContent.finalCTA.title}
          description={landingPageContent.finalCTA.description}
          primaryCTA={landingPageContent.finalCTA.primaryCTA}
        />
      </section>

      <Footer />
    </main>
  )
}
