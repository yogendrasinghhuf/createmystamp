import type { QrCodeElement, QrContentType } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

const CONTENT_TYPE_OPTIONS: { label: string; value: QrContentType }[] = [
  { label: 'Text', value: 'text' },
  { label: 'E-mail', value: 'email' },
  { label: 'Telephone', value: 'telephone' },
]

const PLACEHOLDER_BY_TYPE: Record<QrContentType, string> = {
  text: 'https://example.com or any text',
  email: 'name@example.com',
  telephone: '+1 555 0100',
}

export default function QrCodeProperties({ element }: { element: QrCodeElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<QrCodeElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-sm text-ink/70">QR code type</span>
        <div className="mt-1 flex gap-1">
          {CONTENT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => patch({ contentType: option.value })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                element.contentType === option.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-ink/70 hover:border-ink'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">Content</span>
        <input
          value={element.content}
          onChange={(e) => patch({ content: e.target.value })}
          placeholder={PLACEHOLDER_BY_TYPE[element.contentType]}
          className="rounded-lg border-2 border-accent bg-paper px-2 py-2"
        />
      </label>
      <Slider label="Size" value={element.size} min={8} max={60} onChange={(size) => patch({ size })} />
      <ColorSwatch label="Element color" value={element.color} onChange={(color) => patch({ color })} />
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
