import { LandingHeader } from '@/components/landing/LandingHeader'
import { Hero } from '@/components/landing/Hero'
import { ProofStrip } from '@/components/landing/ProofStrip'
import { ProductWalkthrough } from '@/components/landing/ProductWalkthrough'
import { Results } from '@/components/landing/Results'
import { Features } from '@/components/landing/Features'
import { PricingPreview } from '@/components/landing/PricingPreview'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: '#FAFAF8' }}>
      <LandingHeader />
      <main id="main-content" role="main">
        <Hero />
        <ProofStrip />
        <ProductWalkthrough />
        <Results />
        <Features />
        <PricingPreview />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
