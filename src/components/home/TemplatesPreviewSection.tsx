import { Link } from 'react-router-dom'
import { TEMPLATES } from '../../data/templates'
import Button from '../ui/Button'

export default function TemplatesPreviewSection() {
  const preview = TEMPLATES.slice(0, 3)
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Start from a template</h2>
          <Link to="/templates">
            <Button variant="ghost">View all templates</Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {preview.map((template) => (
            <div key={template.id} className="rounded-xl2 border border-line p-6">
              <p className="text-sm font-semibold">{template.name}</p>
              <p className="mt-1 text-xs text-ink/50">{template.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
