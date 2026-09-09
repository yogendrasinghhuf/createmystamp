const steps = [
  {
    title: '1. Choose a stamp shape',
    body: 'Start in the studio and pick a circle, oval, rectangle, rounded rectangle, or badge shape, then set its size.',
  },
  {
    title: '2. Add text and curved text',
    body: 'Add straight text or bend text along an arc, then adjust font, size, weight, spacing, and color from the properties panel.',
  },
  {
    title: '3. Layer in shapes and images',
    body: 'Add simple shapes, icons, or upload your own PNG, JPG, or SVG artwork, then arrange, resize, and rotate every element.',
  },
  {
    title: '4. Preview the ink effect',
    body: 'Switch between a clean digital preview and a subtle inked, stamped look before you finalize your design.',
  },
  {
    title: '5. Export your stamp',
    body: 'Download your finished stamp as a PNG at 1x, 2x, or 3x resolution, or as a scalable SVG.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-xl2 border border-line p-6">
              <span className="text-sm font-semibold text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
