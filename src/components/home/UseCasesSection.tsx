const useCases = [
  'Small business receipts and packaging',
  'Return-address marks for personal mail',
  'Classroom feedback and encouragement marks',
  'Monogrammed personal stationery',
  'Creative project branding',
]

export default function UseCasesSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Use cases</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <li key={useCase} className="rounded-lg border border-line px-4 py-3 text-sm text-ink/70">
              {useCase}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
