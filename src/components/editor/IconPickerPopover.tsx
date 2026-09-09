import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { STAMP_ICONS } from '../../lib/icons'

interface IconPickerPopoverProps {
  open: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
  triggerRef?: RefObject<HTMLElement | null>
}

export default function IconPickerPopover({ open, onClose, onSelect, triggerRef }: IconPickerPopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (!panelRef.current) return
      const target = e.target as Node
      if (panelRef.current.contains(target)) return
      // Ignore clicks on the trigger button itself: it has its own onClick toggle handler,
      // so treating it as an "outside" click here would close the popover and then have the
      // trigger's toggle immediately reopen it (a flicker), instead of just closing it.
      if (triggerRef?.current && triggerRef.current.contains(target)) return
      onClose()
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, triggerRef])

  if (!open) return null

  // Rendered as a fixed, viewport-centered overlay (like MobileBottomSheet) rather than an
  // absolutely-positioned panel next to the trigger button. The trigger lives inside a narrow,
  // vertically-scrolling desktop rail (overflow-y: auto implies overflow-x: auto, clipping any
  // sibling that overflows the rail's ~72px width) and, on mobile, inside a full-width bottom
  // sheet where a trigger-relative popover can land off-screen. Fixed positioning relative to
  // the viewport sidesteps both containing-block clipping problems entirely.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Add icon"
        className="relative grid w-56 grid-cols-4 gap-2 rounded-xl2 border border-line bg-paper p-3 shadow-lg"
      >
        {STAMP_ICONS.map(({ name, label, innerMarkup }) => (
          <button
            key={name}
            type="button"
            aria-label={label}
            title={label}
            onClick={() => {
              onSelect(name)
              onClose()
            }}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: innerMarkup }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
