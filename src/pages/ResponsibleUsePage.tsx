// src/pages/ResponsibleUsePage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

const prohibited = [
  'Government seals or insignia',
  'Court seals or official judicial marks',
  'Bank or financial institution seals',
  'Identity documents (passports, licenses, ID cards)',
  'Professional credentials or licenses you do not hold',
  'Official certificates issued by an institution you do not represent',
]

export default function ResponsibleUsePage() {
  return (
    <PageShell
      title={`Responsible Use — ${BRAND.name}`}
      description={`Guidelines for responsible, legitimate use of ${BRAND.name}'s stamp design tool.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Responsible Use</h1>
        <p className="mt-4 text-ink/70">
          {BRAND.name} is a general-purpose design tool intended for legitimate creative and
          document workflows &mdash; things like business stamps, address marks, packaging
          notes, classroom feedback, and personal monograms.
        </p>
        <p className="mt-4 text-ink/70">
          {BRAND.name} is not a specialized tool for producing official or legally significant
          seals, and it must not be used to create fraudulent versions of:
        </p>
        <ul className="mt-6 flex flex-col gap-2">
          {prohibited.map((item) => (
            <li key={item} className="rounded-lg border border-line px-4 py-3 text-sm text-ink/70">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink/70">
          None of our templates reproduce real government insignia, and none are designed to
          imitate an official seal. If you are unsure whether your intended use is appropriate,
          consult a legal professional in your jurisdiction before proceeding.
        </p>
      </div>
    </PageShell>
  )
}
