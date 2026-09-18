import { useMemo } from 'react'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import { FAQS } from '../data/faqs'
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
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: BRAND.name,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requires a modern web browser',
          description:
            'Free online stamp maker: design a custom rubber-stamp style mark with curved text, shapes and templates, download it as PNG or SVG, or add the stamp directly to your PDF.',
          featureList: [
            'Round, oval, rectangular and badge stamp shapes',
            'Curved and straight text',
            'Ready-made stamp templates',
            'Dashed and solid shape outlines',
            'PNG and SVG download',
            'Add a stamp to any page of a PDF',
          ],
          offers: [
            {
              '@type': 'Offer',
              name: 'Stamp download',
              price: '199',
              priceCurrency: 'INR',
              description: 'Download a finished stamp as PNG or SVG.',
            },
            {
              '@type': 'Offer',
              name: 'Stamped PDF download',
              price: '249',
              priceCurrency: 'INR',
              description: 'Download a PDF with your stamp placed on it.',
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        },
      ],
    }),
    [],
  )

  return (
    <PageShell
      title={`${BRAND.name} - Free Online Stamp Maker | Design a Stamp & Add It to Your PDF`}
      description="Make a custom stamp online in minutes: choose a shape, add curved text, icons and colors, start from a template, then download as PNG/SVG or stamp it directly onto your PDF. No login, runs in your browser."
      structuredData={structuredData}
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
