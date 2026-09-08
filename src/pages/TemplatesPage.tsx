import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function TemplatesPage() {
  return (
    <PageShell
      title={`Templates — ${BRAND.name}`}
      description="Browse and customize professionally designed stamp templates."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Templates</h1>
      </div>
    </PageShell>
  )
}
