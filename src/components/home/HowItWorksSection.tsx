import { BRAND } from '../../config/brand'

const steps = [
  {
    title: '1. Start from scratch or a template',
    body: 'Open Stamp Studio with a blank round stamp, or pick a ready-made template - business seal, address stamp, "Received", "Paid", teacher mark, monogram and more - then set the diameter.',
  },
  {
    title: '2. Add straight and curved text',
    body: 'Add text along the top and bottom arcs or straight across the middle. Adjust font, size, weight, letter spacing and color from the properties panel.',
  },
  {
    title: '3. Layer shapes, icons and images',
    body: 'Add circles, rectangles, stars, lines and icons, or upload your own PNG, JPG or SVG. Set stroke width, switch to a dashed outline, fill shapes, then move, resize and rotate every element.',
  },
  {
    title: '4. Pick your stamp color',
    body: 'Change the ink color of the whole stamp in one click, or recolor individual elements, and preview exactly how the finished mark will look.',
  },
  {
    title: '5. Download the stamp',
    body: `Export your finished stamp as a PNG at 1x, 2x or 3x resolution - with a transparent background if you like - or as a scalable SVG, for ${BRAND.stampDownloadPrice} per download.`,
  },
  {
    title: '6. Or stamp your PDF directly',
    body: `Open "Add to my PDF", upload a PDF, and drag your stamp onto any page - as many times and on as many pages as you need. Move and resize each one, then download the stamped PDF for ${BRAND.stampedPdfDownloadPrice}.`,
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Process</span>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">How to make a stamp online</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Design a custom stamp in your browser in a few minutes - no software to install and no
          account to create. Then download it, or place it straight onto your PDF.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="relative rounded-xl2 border border-line bg-paper p-6">
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-accent/25"
              />
              <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
