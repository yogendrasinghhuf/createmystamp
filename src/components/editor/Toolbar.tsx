import { useRef, useState } from 'react'
import {
  Type,
  TextCursorInput,
  Circle,
  Square,
  SquareRoundCorner,
  RectangleHorizontal,
  Minus,
  Image as ImageIcon,
  ArrowUpToLine,
  ArrowDownToLine,
  Sparkle,
  Triangle,
  Star,
  Octagon,
  X,
  QrCode,
} from 'lucide-react'
import { useStampStore, useProject } from '../../store/useStampStore'
import { uid } from '../../lib/id'
import { sanitizeSvgString } from '../../lib/sanitizeSvg'
import { STAMP_ICONS, iconToSvgDataUrl } from '../../lib/icons'
import IconButton from '../ui/IconButton'
import IconPickerPopover from './IconPickerPopover'
import type { StampElement } from '../../types/stamp'

export default function Toolbar() {
  const project = useProject()
  const addElement = useStampStore((s) => s.addElement)
  const select = useStampStore((s) => s.select)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconTriggerRef = useRef<HTMLButtonElement>(null)
  const [iconPickerOpen, setIconPickerOpen] = useState(false)

  function nextZIndex(): number {
    return project.elements.length === 0 ? 1 : Math.max(...project.elements.map((el) => el.zIndex)) + 1
  }

  function addAndSelect(element: StampElement) {
    addElement(element)
    select([element.id])
  }

  function handleAddText() {
    addAndSelect({
      id: uid(),
      type: 'text',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'YOUR TEXT',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 6,
      fontWeight: 600,
      letterSpacing: 0,
      align: 'center',
      color: project.ink.color,
      multiline: false,
    })
  }

  function handleAddCurvedText() {
    addAndSelect({
      id: uid(),
      type: 'curvedText',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'CURVED TEXT HERE',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 5,
      fontWeight: 600,
      letterSpacing: 1,
      color: project.ink.color,
      radius: Math.min(project.dimensions.width, project.dimensions.height) / 2 - 6,
      startAngle: 0,
      direction: 'clockwise',
    })
  }

  function handleAddTopText() {
    const radius = Math.min(project.dimensions.width, project.dimensions.height) / 2 - 6
    addAndSelect({
      id: uid(),
      type: 'curvedText',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'TOP TEXT',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 5,
      fontWeight: 600,
      letterSpacing: 1,
      color: project.ink.color,
      radius,
      startAngle: 300,
      direction: 'clockwise',
    })
  }

  function handleAddBottomText() {
    const radius = Math.min(project.dimensions.width, project.dimensions.height) / 2 - 6
    addAndSelect({
      id: uid(),
      type: 'curvedText',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'BOTTOM TEXT',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 5,
      fontWeight: 600,
      letterSpacing: 1,
      color: project.ink.color,
      radius,
      startAngle: 240,
      direction: 'counterclockwise',
    })
  }

  function handleAddQrCode() {
    addAndSelect({
      id: uid(),
      type: 'qrCode',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      content: '',
      contentType: 'text',
      size: 18,
      color: project.ink.color,
    })
  }

  function handleSelectIcon(iconName: string) {
    const option = STAMP_ICONS.find((i) => i.name === iconName)
    if (!option) return
    const color = project.ink.color
    const dataUrl = iconToSvgDataUrl(option.innerMarkup, color)
    if (!dataUrl) return
    addAndSelect({
      id: uid(),
      type: 'image',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      src: dataUrl,
      width: 12,
      height: 12,
      isSvg: true,
      iconName: option.name,
      color,
    })
  }

  function handleAddShape(
    shape: 'circle' | 'rectangle' | 'roundedRectangle' | 'line' | 'triangle' | 'star' | 'octagon' | 'x',
    dimensions?: { width: number; height: number },
  ) {
    addAndSelect({
      id: uid(),
      type: 'shape',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      shape,
      width: dimensions?.width ?? (shape === 'line' ? 20 : shape === 'rectangle' || shape === 'roundedRectangle' ? 28 : 16),
      height: dimensions?.height ?? (shape === 'line' ? 0.5 : shape === 'rectangle' || shape === 'roundedRectangle' ? 7 : 16),
      strokeColor: project.ink.color,
      strokeWidth: 0.6,
      fillColor: project.ink.color,
      filled: false,
      cornerRadius: shape === 'roundedRectangle' ? 3 : undefined,
    })
  }

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()

    if (file.type === 'image/svg+xml') {
      reader.onload = () => {
        const raw = reader.result as string
        const cleaned = sanitizeSvgString(raw)
        if (!cleaned) return
        const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleaned)))}`
        addAndSelect({
          id: uid(),
          type: 'image',
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: nextZIndex(),
          src: dataUrl,
          width: 20,
          height: 20,
          isSvg: true,
        })
      }
      reader.readAsText(file)
    } else {
      reader.onload = () => {
        addAndSelect({
          id: uid(),
          type: 'image',
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: nextZIndex(),
          src: reader.result as string,
          width: 20,
          height: 20,
          isSvg: false,
        })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2 p-3 md:gap-1 md:p-1.5">
      <IconButton
        icon={<Type size={18} />}
        label="Text"
        showLabel
        onClick={handleAddText}
        className="min-h-11 md:min-h-8 border-line hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        icon={<TextCursorInput size={18} />}
        label="Curved text"
        showLabel
        onClick={handleAddCurvedText}
        className="min-h-11 md:min-h-8 border-line hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        icon={<ArrowUpToLine size={18} />}
        label="Top text"
        showLabel
        onClick={handleAddTopText}
        className="min-h-11 md:min-h-8 border-line hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        icon={<ArrowDownToLine size={18} />}
        label="Bottom text"
        showLabel
        onClick={handleAddBottomText}
        className="min-h-11 md:min-h-8 border-line hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        ref={iconTriggerRef}
        icon={<Sparkle size={18} />}
        label="Icon"
        showLabel
        onClick={() => setIconPickerOpen((v) => !v)}
        className="min-h-11 md:min-h-8 border-line hover:border-amber-400 hover:bg-amber-50"
      />
      <IconPickerPopover
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={handleSelectIcon}
        triggerRef={iconTriggerRef}
      />
      <IconButton
        icon={<Circle size={18} />}
        label="Circle"
        showLabel
        onClick={() => handleAddShape('circle')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<RectangleHorizontal size={18} />}
        label="Rectangle"
        showLabel
        onClick={() => handleAddShape('rectangle')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Square size={18} />}
        label="Square"
        showLabel
        onClick={() => handleAddShape('rectangle', { width: 18, height: 18 })}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<SquareRoundCorner size={18} />}
        label="Rounded rect."
        showLabel
        onClick={() => handleAddShape('roundedRectangle')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Minus size={18} />}
        label="Line"
        showLabel
        onClick={() => handleAddShape('line')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Triangle size={18} />}
        label="Triangle"
        showLabel
        onClick={() => handleAddShape('triangle')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Star size={18} />}
        label="Star"
        showLabel
        onClick={() => handleAddShape('star')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Octagon size={18} />}
        label="Octagon"
        showLabel
        onClick={() => handleAddShape('octagon')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<X size={18} />}
        label="X mark"
        showLabel
        onClick={() => handleAddShape('x')}
        className="min-h-11 md:min-h-8 border-line hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<QrCode size={18} />}
        label="QR code"
        showLabel
        onClick={handleAddQrCode}
        className="min-h-11 md:min-h-8 border-line hover:border-amber-400 hover:bg-amber-50"
      />
      <IconButton
        icon={<ImageIcon size={18} />}
        label="Image"
        showLabel
        onClick={() => fileInputRef.current?.click()}
        className="min-h-11 md:min-h-8 border-line hover:border-emerald-400 hover:bg-emerald-50"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={handleFileChosen}
      />
    </div>
  )
}
