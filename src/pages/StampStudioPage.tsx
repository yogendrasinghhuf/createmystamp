import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function StampStudioPage() {
  return (
    <PageShell
      title={`Stamp Studio — ${BRAND.name}`}
      description="Design and customize your own professional stamp online."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Stamp Studio</h1>
      </div>
    </PageShell>
  )
}
