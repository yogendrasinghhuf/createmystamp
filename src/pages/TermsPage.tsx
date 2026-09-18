// src/pages/TermsPage.tsx
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function TermsPage() {
  return (
    <PageShell
      title={`Terms of Use - ${BRAND.name}`}
      description={`Terms of use for ${BRAND.name}, the online stamp maker and PDF stamping tool: acceptable use, downloads and payments, your content, intellectual property and copyright.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-4 text-sm text-ink/50">
          Last updated {new Date().getFullYear()}. These terms should be reviewed by a qualified
          lawyer before commercial launch.
        </p>
        <div className="mt-8 flex flex-col gap-6 text-ink/70">
          <section>
            <h2 className="text-lg font-semibold text-ink">What {BRAND.name} is</h2>
            <p className="mt-2">
              {BRAND.name} is an online stamp maker. It lets you design custom stamp artwork in
              your browser - from a blank canvas or a ready-made template - download
              it as a PNG or SVG image, and place that stamp onto the pages of a PDF you upload.
              By using {BRAND.name} you agree to these terms.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Acceptable use</h2>
            <p className="mt-2">
              {BRAND.name} is provided for legitimate personal, educational and business use:
              company seals, &ldquo;Received&rdquo; and &ldquo;Paid&rdquo; marks, address and
              packaging stamps, teacher stamps, monograms, and stamping your own documents. You
              agree to use it responsibly and lawfully and not to infringe anyone else&rsquo;s
              rights.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Prohibited use</h2>
            <p className="mt-2">
              You may not use {BRAND.name} to create or apply fraudulent official seals,
              government or court insignia, bank seals, identity documents, or credentials you do
              not hold, or to stamp a document in a way that misrepresents its origin or approval.
              See our <Link to="/responsible-use" className="text-accent hover:underline">Responsible Use</Link>{' '}
              page for details.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Downloads and payments</h2>
            <p className="mt-2">
              Designing, previewing and editing a stamp, browsing templates, and placing stamps
              onto a PDF are free. Downloads are priced per file: a finished stamp file (PNG or
              SVG) costs {BRAND.stampDownloadPrice}, and a stamped PDF costs{' '}
              {BRAND.stampedPdfDownloadPrice}. Each additional file you download is a separate
              payment. Because a download is delivered instantly and generated from your own
              design, payments are non-refundable once the file has been produced, except where
              required by law. If a download fails after
              payment, <Link to="/contact" className="text-accent hover:underline">contact us</Link> and
              we will make it right.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Your content</h2>
            <p className="mt-2">
              Any text, images, stamp designs and PDF documents you create or open in {BRAND.name}{' '}
              remain yours. {BRAND.name} runs entirely in your browser, so we do not receive, host,
              or claim any rights to your designs or documents. You are responsible for making
              sure you have the right to use any text, artwork or document you bring into the
              tool.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Intellectual property and copyright</h2>
            <p className="mt-2">
              The {BRAND.name} name, website, software, editor, template designs and all
              accompanying text and artwork are &copy; {new Date().getFullYear()} {BRAND.name}.
              All rights reserved. Templates are provided for you to customise and use in your own
              stamps; you may not resell, redistribute or republish the templates, the software or
              any part of this website as your own. Stamps you design using the tool, including
              those started from a template, are yours to use for any lawful purpose.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">No warranty</h2>
            <p className="mt-2">
              {BRAND.name} is provided &ldquo;as is&rdquo; without warranties of any kind, express
              or implied. We do not guarantee that a stamp or stamped PDF produced with the tool is
              suitable for any particular legal, official or commercial purpose.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Contact</h2>
            <p className="mt-2">
              Questions about these terms? Reach us via the{' '}
              <Link to="/contact" className="text-accent hover:underline">Contact</Link> page or at{' '}
              <a href={`mailto:${BRAND.contactEmail}`} className="text-accent hover:underline">
                {BRAND.contactEmail}
              </a>
              . Support hours: {BRAND.supportHours}.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
