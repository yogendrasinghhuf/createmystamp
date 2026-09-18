// src/pages/PrivacyPage.tsx
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function PrivacyPage() {
  return (
    <PageShell
      title={`Privacy Policy - ${BRAND.name}`}
      description={`Privacy policy for ${BRAND.name}. Your stamp designs and PDFs never leave your browser - no uploads, no account, no tracking. Learn what is stored locally and how payments are handled.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/50">
          Last updated {new Date().getFullYear()}. This policy should be reviewed by a qualified
          lawyer before commercial launch.
        </p>
        <div className="mt-8 flex flex-col gap-6 text-ink/70">
          <section>
            <h2 className="text-lg font-semibold text-ink">The short version</h2>
            <p className="mt-2">
              {BRAND.name} runs entirely in your browser. Your stamp designs, the images you add
              to them, and any PDF you open in &ldquo;Add to my PDF&rdquo; are processed on your
              own device and are never uploaded to, or stored on, our servers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">What we do not collect</h2>
            <p className="mt-2">
              We do not require an account, and we do not collect, transmit or store your stamp
              designs, uploaded images, PDF documents, or the stamped PDFs you download. We do not
              use cookies or analytics tracking on the design tool.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Local storage on your device</h2>
            <p className="mt-2">
              Your current Stamp Studio design is saved in your browser&rsquo;s local storage so it
              survives a page refresh. This stays on your device and is never sent anywhere;
              clearing your browser data removes it. PDFs you open in &ldquo;Add to my PDF&rdquo;
              and the stamps you place on them are kept only in memory for the current session and
              are discarded when you close or reload the page.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Payments</h2>
            <p className="mt-2">
              Downloads are paid per file. When you pay for a download, the payment is handled by a
              third-party payment provider; we do not see or store your full card details. The
              payment provider&rsquo;s own privacy policy applies to the information you give
              them. We may retain a minimal record of a completed payment (such as a transaction
              reference) to deliver your download and provide support.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Contacting us</h2>
            <p className="mt-2">
              If you email us via the <Link to="/contact" className="text-accent hover:underline">Contact</Link>{' '}
              page, the message is sent from your own email app to{' '}
              <a href={`mailto:${BRAND.contactEmail}`} className="text-accent hover:underline">
                {BRAND.contactEmail}
              </a>
              . We use what you send only to reply to you and provide support.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Changes to this policy</h2>
            <p className="mt-2">
              This policy may change as {BRAND.name} evolves. The date at the top shows when it
              was last updated.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
