import { FAQS } from '../../data/faqs'

export default function FaqPreviewSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-3xl px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">FAQ</span>
        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
        <p className="mt-2 text-sm text-ink/60">
          Everything you need to know about designing a stamp online, using templates, and adding
          a stamp to a PDF.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl2 border border-line bg-paper p-5 shadow-card transition-colors hover:border-accent/25"
            >
              <h3 className="font-display font-semibold text-ink">{faq.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
