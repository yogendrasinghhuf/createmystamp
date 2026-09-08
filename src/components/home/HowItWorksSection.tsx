const steps = [
  { title: 'Pick a shape', body: 'Start blank or choose a circle, oval, rectangle, rounded rectangle, or badge.' },
  { title: 'Add your details', body: 'Drop in text, curved text, shapes, or your own artwork, then arrange them on the canvas.' },
  { title: 'Export and use', body: 'Preview the clean or inked look, then download a crisp PNG or scalable SVG.' },
]

export default function HowItWorksSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
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
