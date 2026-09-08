const features = [
  { title: 'True curved text', body: 'Bend text along a real arc with control over radius, spacing, and start position.' },
  { title: 'Layered composition', body: 'Stack text, shapes, and images with full control over order, rotation, and size.' },
  { title: 'Ink preview', body: 'Toggle a clean digital look or a subtle inked, stamped texture before you export.' },
  { title: 'Undo-friendly', body: 'Every change is tracked, so you can experiment freely and step back anytime.' },
]

export default function FeaturesSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Editor features</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl2 border border-line p-6">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
