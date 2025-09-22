import { HeroSection } from '@/components/sections/hero-section'
import { ValueProposition } from '@/components/sections/value-proposition'
import { ProcessSection } from '@/components/sections/process-section'
import { FeatureGrid } from '@/components/sections/feature-grid'
import { SocialProof } from '@/components/sections/social-proof'
import { CTASection } from '@/components/sections/cta-section'
import { landingPageContent, videoConfiguration } from '@/data/landing-content'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection
        title={landingPageContent.hero.title}
        subtitle={landingPageContent.hero.subtitle}
        description={landingPageContent.hero.description}
        primaryCTA={landingPageContent.hero.primaryCTA}
        secondaryCTA={landingPageContent.hero.secondaryCTA}
        backgroundVideo={videoConfiguration}
      />

      <ValueProposition
        title={landingPageContent.valueProposition.title}
        subtitle={landingPageContent.valueProposition.subtitle}
        problemStatement={landingPageContent.valueProposition.problemStatement}
        solutionStatement={landingPageContent.valueProposition.solutionStatement}
        keyDifferentiator={landingPageContent.valueProposition.keyDifferentiator}
        supportingMetrics={landingPageContent.valueProposition.metrics}
      />

      <ProcessSection
        title={landingPageContent.process.title}
        description={landingPageContent.process.description}
        steps={landingPageContent.process.steps}
      />

      <FeatureGrid
        title={landingPageContent.benefits.title}
        subtitle={landingPageContent.benefits.subtitle}
        description={landingPageContent.benefits.description}
        features={landingPageContent.benefits.features}
        layout="grid-3"
      />

      <SocialProof
        title={landingPageContent.socialProof.title}
        statistics={landingPageContent.socialProof.statistics}
        trustIndicators={landingPageContent.socialProof.trustIndicators}
      />

      <CTASection
        title={landingPageContent.finalCTA.title}
        description={landingPageContent.finalCTA.description}
        primaryCTA={landingPageContent.finalCTA.primaryCTA}
        secondaryCTA={landingPageContent.finalCTA.secondaryCTA}
        urgency={landingPageContent.finalCTA.urgency}
      />
    </main>
  )
}
