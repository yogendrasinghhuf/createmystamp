const useCases = [
  '"Received", "Paid" and "Approved" stamps for invoices and receipts',
  'Company seals and "Authorised Signatory" marks on business documents',
  'Stamping contracts, quotations and statements as PDFs - no printing',
  'Return-address and packaging stamps for shipping and small business',
  'Classroom feedback and encouragement stamps for teachers',
  'Monogrammed personal stationery and creative project branding',
]

export default function UseCasesSection() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Use cases</span>
        <h2 className="mt-2 text-2xl font-semibold text-paper sm:text-3xl">What people make with it</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <li
              key={useCase}
              className="flex items-start gap-3 rounded-xl2 border border-paper/15 bg-paper/[0.04] px-4 py-3.5 text-sm leading-relaxed text-paper/80 transition-colors hover:border-accent-light/40 hover:bg-paper/[0.07]"
            >
              <span aria-hidden="true" className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-light" />
              {useCase}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
