// src/pages/HowItWorksPage.tsx
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import Button from '../components/ui/Button'

const steps = [
  {
    title: '1. Choose a stamp shape',
    body: 'Start in Stamp Studio and pick a circle, oval, rectangle, rounded rectangle, or badge shape, then set its size.',
  },
  {
    title: '2. Add text and curved text',
    body: 'Add straight text or bend text along an arc, then adjust font, size, weight, spacing, and color from the properties panel.',
  },
  {
    title: '3. Layer in shapes and images',
    body: 'Add simple shapes or upload your own PNG, JPG, or SVG artwork, then arrange, resize, and rotate every element.',
  },
  {
    title: '4. Preview the ink effect',
    body: 'Switch between a clean digital preview and a subtle inked, stamped look before you finalize your design.',
  },
  {
    title: '5. Export your stamp',
    body: 'Download your finished stamp as a PNG at 1x, 2x, or 3x resolution, or as a scalable SVG.',
  },
]

export default function HowItWorksPage() {
  return (
    <PageShell
      title={`How It Works — ${BRAND.name}`}
      description={`See how to design, customize, and export a custom stamp online in minutes with ${BRAND.name}.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">How It Works</h1>
        <div className="mt-10 flex flex-col gap-8">
          {steps.map((step) => (
            <div key={step.title}>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="mt-1 text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
        <Link to="/studio" className="mt-10 inline-block">
          <Button>Open Stamp Studio</Button>
        </Link>
      </div>
    </PageShell>
  )
}
