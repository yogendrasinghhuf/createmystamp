// src/pages/TermsPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function TermsPage() {
  return (
    <PageShell
      title={`Terms of Use — ${BRAND.name}`}
      description={`Placeholder terms of use for ${BRAND.name}, an in-browser stamp design tool.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-4 text-sm text-ink/50">
          This is a placeholder terms document for the {BRAND.name} MVP. It should be reviewed by
          a qualified lawyer before this product is used commercially or launched publicly.
        </p>
        <div className="mt-8 flex flex-col gap-6 text-ink/70">
          <section>
            <h2 className="text-lg font-semibold text-ink">Using the tool</h2>
            <p className="mt-2">
              {BRAND.name} is provided as a design tool for creating custom stamp artwork for
              legitimate personal, educational, and business use. By using this tool, you agree to
              use it responsibly and lawfully.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Your content</h2>
            <p className="mt-2">
              Any text, images, or designs you create or upload remain yours. Since {BRAND.name}
              runs client-side, we do not host or claim any rights to your designs.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Prohibited use</h2>
            <p className="mt-2">
              You may not use {BRAND.name} to create fraudulent official seals, identity documents,
              or credentials. See our Responsible Use page for details.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">No warranty</h2>
            <p className="mt-2">
              {BRAND.name} is provided "as is" without warranties of any kind, express or implied.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
