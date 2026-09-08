import { Link } from 'react-router-dom'

const faqs = [
  { q: 'Do I need an account?', a: 'No. Stamp Studio works entirely in your browser, and your project is saved locally on your device.' },
  { q: 'Can I use my own artwork?', a: 'Yes, upload a PNG, JPG, or SVG and position it anywhere on your stamp.' },
  { q: 'What file formats can I export?', a: 'PNG at multiple resolutions, and SVG for scalable vector use.' },
]

export default function FaqPreviewSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-8 flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl2 border border-line p-5">
              <p className="font-medium">{faq.q}</p>
              <p className="mt-1 text-sm text-ink/60">{faq.a}</p>
            </div>
          ))}
        </div>
        <Link to="/faq" className="mt-6 inline-block text-sm text-accent underline">
          See all questions
        </Link>
      </div>
    </section>
  )
}
