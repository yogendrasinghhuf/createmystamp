import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function HowItWorksPage() {
  return (
    <PageShell
      title={`How It Works — ${BRAND.name}`}
      description="See how to design, customize, and export a custom stamp online in minutes."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">How It Works</h1>
      </div>
    </PageShell>
  )
}
