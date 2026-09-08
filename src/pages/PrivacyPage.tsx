import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function PrivacyPage() {
  return (
    <PageShell
      title={`Privacy Policy — ${BRAND.name}`}
      description="Our privacy policy and how we handle your data."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      </div>
    </PageShell>
  )
}
