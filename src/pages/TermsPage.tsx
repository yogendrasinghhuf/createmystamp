import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function TermsPage() {
  return (
    <PageShell
      title={`Terms of Service — ${BRAND.name}`}
      description="Our terms of service and conditions of use."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Terms of Service</h1>
      </div>
    </PageShell>
  )
}
