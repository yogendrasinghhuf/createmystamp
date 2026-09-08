// src/pages/PrivacyPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function PrivacyPage() {
  return (
    <PageShell
      title={`Privacy Policy — ${BRAND.name}`}
      description={`Placeholder privacy policy for ${BRAND.name}, an in-browser stamp design tool.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/50">
          This is a placeholder policy for the {BRAND.name} MVP. It should be reviewed by a
          qualified lawyer before this product is used commercially or launched publicly.
        </p>
        <div className="mt-8 flex flex-col gap-6 text-ink/70">
          <section>
            <h2 className="text-lg font-semibold text-ink">What we collect</h2>
            <p className="mt-2">
              {BRAND.name} runs entirely in your browser. We do not operate a backend server, and
              we do not collect, transmit, or store your stamp designs, uploaded images, or
              personal information on any server.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Local storage</h2>
            <p className="mt-2">
              Your current project is saved using your browser&rsquo;s local storage so that it
              survives a page refresh. This data stays on your device and is never transmitted
              anywhere. Clearing your browser data will remove it.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Cookies and analytics</h2>
            <p className="mt-2">This MVP does not use cookies or analytics tracking.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Changes to this policy</h2>
            <p className="mt-2">
              This placeholder policy may change as {BRAND.name} evolves. Check back for updates.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
