import { useRef, useState } from 'react'
import {
  Type,
  TextCursorInput,
  Circle,
  Square,
  RectangleHorizontal,
  Minus,
  Image as ImageIcon,
  ArrowUpToLine,
  ArrowDownToLine,
  Sparkle,
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
      color: '#2B2A28',
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
      color: '#2B2A28',
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
      color: '#2B2A28',
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
      color: '#2B2A28',
      radius,
      startAngle: 75,
      direction: 'clockwise',
    })
  }

  function handleSelectIcon(iconName: string) {
    const option = STAMP_ICONS.find((i) => i.name === iconName)
    if (!option) return
    const dataUrl = iconToSvgDataUrl(option.innerMarkup, '#2B2A28')
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
    })
  }

  function handleAddShape(shape: 'circle' | 'rectangle' | 'roundedRectangle' | 'line') {
    addAndSelect({
      id: uid(),
      type: 'shape',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      shape,
      width: shape === 'line' ? 20 : 16,
      height: shape === 'line' ? 0.5 : 16,
      strokeColor: '#2B2A28',
      strokeWidth: 1,
      fillColor: '#2B2A28',
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
        className="min-h-11 md:min-h-8 border-line text-sky-700 hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        icon={<TextCursorInput size={18} />}
        label="Curved text"
        showLabel
        onClick={handleAddCurvedText}
        className="min-h-11 md:min-h-8 border-line text-sky-700 hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        icon={<ArrowUpToLine size={18} />}
        label="Top text"
        showLabel
        onClick={handleAddTopText}
        className="min-h-11 md:min-h-8 border-line text-sky-700 hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        icon={<ArrowDownToLine size={18} />}
        label="Bottom text"
        showLabel
        onClick={handleAddBottomText}
        className="min-h-11 md:min-h-8 border-line text-sky-700 hover:border-sky-400 hover:bg-sky-50"
      />
      <IconButton
        ref={iconTriggerRef}
        icon={<Sparkle size={18} />}
        label="Icon"
        showLabel
        onClick={() => setIconPickerOpen((v) => !v)}
        className="min-h-11 md:min-h-8 border-line text-amber-700 hover:border-amber-400 hover:bg-amber-50"
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
        className="min-h-11 md:min-h-8 border-line text-violet-700 hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<RectangleHorizontal size={18} />}
        label="Rectangle"
        showLabel
        onClick={() => handleAddShape('rectangle')}
        className="min-h-11 md:min-h-8 border-line text-violet-700 hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Square size={18} />}
        label="Rounded rect."
        showLabel
        onClick={() => handleAddShape('roundedRectangle')}
        className="min-h-11 md:min-h-8 border-line text-violet-700 hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<Minus size={18} />}
        label="Line"
        showLabel
        onClick={() => handleAddShape('line')}
        className="min-h-11 md:min-h-8 border-line text-violet-700 hover:border-violet-400 hover:bg-violet-50"
      />
      <IconButton
        icon={<ImageIcon size={18} />}
        label="Image"
        showLabel
        onClick={() => fileInputRef.current?.click()}
        className="min-h-11 md:min-h-8 border-line text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50"
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
