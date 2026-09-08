import { useState } from 'react'
import TemplateGrid from '../templates/TemplateGrid'
import { TEMPLATES, type StampTemplate } from '../../data/templates'
import { TEMPLATE_CATEGORIES } from '../../data/templateCategories'
import { useStampStore } from '../../store/useStampStore'
import { uid } from '../../lib/id'
import Button from '../ui/Button'

export default function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const loadProject = useStampStore((s) => s.loadProject)

  const filtered =
    activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

  function handleUse(template: StampTemplate) {
    loadProject({ ...template.project, id: uid(), updatedAt: Date.now() })
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="templates" className="scroll-mt-20 border-t border-line bg-paper py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Templates</h2>
        <p className="mt-2 text-ink/60">
          Start from an original layout and make it your own in the studio above.
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
    </section>
  )
}
