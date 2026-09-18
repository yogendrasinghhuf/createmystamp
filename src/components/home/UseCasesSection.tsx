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
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">What people make with it</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <li key={useCase} className="rounded-xl2 border border-line bg-paper px-4 py-3 text-sm text-ink/70 shadow-card transition-shadow hover:shadow-soft">
              {useCase}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
