import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function ResponsibleUsePage() {
  return (
    <PageShell
      title={`Responsible Use — ${BRAND.name}`}
      description={`Guidelines for responsible and ethical use of ${BRAND.name}.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Responsible Use</h1>
      </div>
    </PageShell>
  )
}
