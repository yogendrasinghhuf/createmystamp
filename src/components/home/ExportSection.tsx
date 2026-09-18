import { BRAND } from '../../config/brand'

const formats = [
  {
    title: 'PNG stamp image',
    body: 'Raster export at 1x, 2x or 3x resolution with an optional transparent background - ready for documents, websites and print.',
    price: BRAND.stampDownloadPrice,
  },
  {
    title: 'SVG vector stamp',
    body: 'Clean vector output that preserves your exact artwork, so it stays crisp at any size and can be edited in any vector tool.',
    price: BRAND.stampDownloadPrice,
  },
  {
    title: 'Stamped PDF',
    body: 'Your original PDF with every placed stamp embedded at its exact position, size and page - a standard PDF that opens anywhere.',
    price: BRAND.stampedPdfDownloadPrice,
  },
]

export default function ExportSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Downloads</span>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Download options</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Design and preview for free. Pay only when you download the final file.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {formats.map((format) => (
            <div
              key={format.title}
              className="rounded-xl2 border border-line bg-paper p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-stamp-blue/30 hover:shadow-soft"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">{format.title}</h3>
                <span className="shrink-0 text-sm font-semibold text-accent">{format.price}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{format.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
