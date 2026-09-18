// src/pages/ResponsibleUsePage.tsx
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

const legitimate = [
  'Company seals and "Authorised Signatory" stamps for your own business',
  '"Received", "Paid", "Approved" and dated marks on your own invoices and receipts',
  'Return-address, packaging and shipping stamps',
  'Teacher feedback and classroom encouragement stamps',
  'Personal monograms, stationery and creative branding',
  'Stamping your own PDFs — quotations, statements, contracts you are party to',
]

const prohibited = [
  'Government seals, national emblems or official insignia',
  'Court seals or official judicial marks',
  'Bank, notary or financial institution seals',
  'Identity documents (passports, licences, ID cards)',
  'Professional credentials or licences you do not hold',
  'Official certificates issued by an institution you do not represent',
  'Stamping a document to fake approval, receipt or signature by someone else',
]

export default function ResponsibleUsePage() {
  return (
    <PageShell
      title={`Responsible Use — ${BRAND.name}`}
      description={`How to use ${BRAND.name}'s online stamp maker and PDF stamping tool responsibly: what it is for, and the official seals and documents it must never be used to imitate.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Responsible Use</h1>
        <p className="mt-4 text-ink/70">
          {BRAND.name} is a general-purpose stamp design tool. It exists to help you make marks
          for your own business, classroom, mail and creative work, and to place them onto your
          own documents. Used this way it saves you ordering a physical rubber stamp or printing a
          document just to stamp it.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-ink">Intended use</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {legitimate.map((item) => (
            <li key={item} className="rounded-lg border border-line px-4 py-3 text-sm text-ink/70">
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-ink">Never use it to imitate</h2>
        <p className="mt-2 text-ink/70">
          {BRAND.name} is not a tool for producing official or legally significant seals, and it
          must not be used to create, or stamp onto a PDF, a fraudulent version of any of the
          following:
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {prohibited.map((item) => (
            <li key={item} className="rounded-lg border border-line px-4 py-3 text-sm text-ink/70">
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-ink/70">
          None of our templates reproduce real government insignia, and none are designed to
          imitate an official seal. Stamping a PDF with {BRAND.name} adds an image to the page; it
          is not a digital signature and does not certify or authenticate a document. If you are
          unsure whether your intended use is appropriate, consult a legal professional in your
          jurisdiction, or <Link to="/contact" className="text-accent hover:underline">ask us</Link>{' '}
          before proceeding. See also our <Link to="/terms" className="text-accent hover:underline">Terms of Use</Link>.
        </p>
      </div>
    </PageShell>
  )
}
