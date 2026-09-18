import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'

export default function NotFoundPage() {
  return (
    <PageShell title="Page not found" description="This page does not exist." noindex>
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent underline">
          Back home
        </Link>
      </div>
    </PageShell>
  )
}
