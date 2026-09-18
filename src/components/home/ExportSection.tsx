const formats = [
  {
    title: 'PNG stamp image',
    body: 'Raster export at 1x, 2x or 3x resolution with an optional transparent background - ready for documents, websites and print.',
  },
  {
    title: 'SVG vector stamp',
    body: 'Clean vector output that preserves your exact artwork, so it stays crisp at any size and can be edited in any vector tool.',
  },
  {
    title: 'Stamped PDF',
    body: 'Your original PDF with every placed stamp embedded at its exact position, size and page - a standard PDF that opens anywhere.',
  },
]

export default function ExportSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Download options</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Design and preview for free. Each download - one stamp file or one stamped PDF - is a
          single one-time payment.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {formats.map((format) => (
            <div key={format.title} className="rounded-xl2 border border-line bg-paper p-6 shadow-card transition-shadow hover:shadow-soft">
              <h3 className="text-lg font-semibold">{format.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{format.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
