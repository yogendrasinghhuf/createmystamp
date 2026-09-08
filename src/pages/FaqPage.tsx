import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function FaqPage() {
  return (
    <PageShell
      title={`FAQ — ${BRAND.name}`}
      description={`Frequently asked questions about ${BRAND.name} stamp design and usage.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">FAQ</h1>
      </div>
    </PageShell>
  )
}
