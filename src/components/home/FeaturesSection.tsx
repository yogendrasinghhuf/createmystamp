const features = [
  {
    title: 'Ready-made stamp templates',
    body: 'Business seals, address stamps, "Received" and "Paid" marks, teacher stamps, monograms and packaging labels - load one and make it your own.',
  },
  {
    title: 'True curved text',
    body: 'Bend text along a real arc around the top or bottom of a round stamp, with control over radius, spacing and direction.',
  },
  {
    title: 'Shapes with dashed outlines',
    body: 'Circles, rectangles, stars, octagons and lines with adjustable stroke width, fill, and an evenly spaced dashed border option.',
  },
  {
    title: 'Stamp your PDF directly',
    body: 'Drag your finished stamp onto any page of a PDF - multiple stamps, multiple pages, any mix of designs - and download the stamped document.',
  },
  {
    title: 'Layered composition',
    body: 'Stack text, shapes, icons and images with full control over order, rotation, position and size, guided by a millimetre ruler.',
  },
  {
    title: 'Private by design',
    body: 'Everything runs in your browser. Your stamp design and your PDF never leave your device - no upload, no account, no tracking.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Features</span>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Stamp maker features</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl2 border border-line bg-paper p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
            >
              <div
                aria-hidden="true"
                className="absolute -right-6 -top-6 h-16 w-16 rounded-full border-2 border-accent/0 transition-colors duration-200 group-hover:border-accent/15"
              />
              <h3 className="font-display text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
