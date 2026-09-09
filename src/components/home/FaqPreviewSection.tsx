import { BRAND } from '../../config/brand'

const faqs = [
  { q: 'Do I need to create an account?', a: 'No. Every feature works without signing up, and your in-progress design is saved locally in your browser.' },
  { q: 'Is my design uploaded anywhere?', a: `${BRAND.name} runs entirely in your browser. Nothing about your design is sent to a server.` },
  { q: 'What image formats can I upload?', a: 'You can upload PNG, JPG, or SVG files. Uploaded SVG files are automatically cleaned of scripts before use.' },
  { q: 'Can I undo mistakes?', a: 'Yes, use Ctrl/Cmd+Z to undo and Ctrl/Cmd+Shift+Z to redo, or the undo/redo buttons in the editor.' },
  { q: 'What can I export?', a: 'PNG (at 1x, 2x, or 3x, with optional transparency) and SVG (true vector artwork).' },
  { q: 'Will my work survive a page refresh?', a: 'Yes, your current project autosaves to your browser and reloads automatically.' },
  { q: 'Can I use this for official government or legal seals?', a: 'No. See our Responsible Use page — this tool is intended for legitimate design and creative or document workflows only.' },
]

export default function FaqPreviewSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-8 flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl2 border border-line bg-paper p-5 shadow-card">
              <p className="font-medium">{faq.q}</p>
              <p className="mt-1 text-sm text-ink/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
