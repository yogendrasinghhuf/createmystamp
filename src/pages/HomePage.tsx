import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import EditorHeroHeader from '../components/home/EditorHeroHeader'
import StampStudioSection from '../components/home/StampStudioSection'
import TemplatesSection from '../components/home/TemplatesSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import FeaturesSection from '../components/home/FeaturesSection'
import ExportSection from '../components/home/ExportSection'
import UseCasesSection from '../components/home/UseCasesSection'
import FaqPreviewSection from '../components/home/FaqPreviewSection'
import FinalCtaSection from '../components/home/FinalCtaSection'

export default function HomePage() {
  return (
    <PageShell
      title={`${BRAND.name} — Online Stamp Maker`}
      description="Design a custom stamp online: choose a shape, add text and curved text, preview the ink effect, and export as PNG or SVG. No login required."
    >
      <EditorHeroHeader />
      <StampStudioSection />
      <TemplatesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ExportSection />
      <UseCasesSection />
      <FaqPreviewSection />
      <FinalCtaSection />
    </PageShell>
  )
}
