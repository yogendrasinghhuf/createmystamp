import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import TemplateGrid from '../components/templates/TemplateGrid'
import { TEMPLATES, type StampTemplate } from '../data/templates'
import { TEMPLATE_CATEGORIES } from '../data/templateCategories'
import { useStampStore } from '../store/useStampStore'
import { uid } from '../lib/id'
import Button from '../components/ui/Button'
import { BRAND } from '../config/brand'

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const loadProject = useStampStore((s) => s.loadProject)
  const navigate = useNavigate()

  const filtered =
    activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

  function handleUse(template: StampTemplate) {
    loadProject({ ...template.project, id: uid(), updatedAt: Date.now() })
    navigate('/studio')
  }

  return (
    <PageShell
      title={`Templates — ${BRAND.name}`}
      description="Browse original stamp templates for business, address, packaging, personal, creative, teacher, monogram, and date stamps."
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Templates</h1>
        <p className="mt-2 text-ink/60">
          Start from an original layout and make it your own in Stamp Studio.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'All' ? 'primary' : 'secondary'}
            onClick={() => setActiveCategory('All')}
          >
            All
          </Button>
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'primary' : 'secondary'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="mt-8">
          <TemplateGrid templates={filtered} onUse={handleUse} />
        </div>
      </div>
    </PageShell>
  )
}
