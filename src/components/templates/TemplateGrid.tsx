import type { StampTemplate } from '../../data/templates'
import TemplateCard from './TemplateCard'

export default function TemplateGrid({
  templates,
  onUse,
}: {
  templates: StampTemplate[]
  onUse: (template: StampTemplate) => void
}) {
  if (templates.length === 0) {
    return <p className="text-sm text-ink/50">No templates in this category yet.</p>
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onUse={onUse} />
      ))}
    </div>
  )
}
