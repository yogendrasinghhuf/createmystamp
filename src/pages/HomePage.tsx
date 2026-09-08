import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function HomePage() {
  return (
    <PageShell
      title={`${BRAND.name} — ${BRAND.tagline}`}
      description={BRAND.supportingCopy}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Home</h1>
      </div>
    </PageShell>
  )
}
