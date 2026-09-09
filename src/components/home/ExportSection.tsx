const formats = [
  { title: 'PNG', body: 'Raster export at 1x, 2x, or 3x, with optional transparent background.' },
  { title: 'SVG', body: 'Clean vector output that preserves your exact artwork for resizing later.' },
]

export default function ExportSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Export options</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
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
