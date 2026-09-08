import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Star, Check, Heart, Award, Shield, Flag, BadgeCheck, Sparkles, ThumbsUp, Gift,
  type LucideIcon,
} from 'lucide-react'
import { sanitizeSvgString } from './sanitizeSvg'

export interface StampIconOption {
  name: string
  label: string
  Icon: LucideIcon
}

export const STAMP_ICONS: StampIconOption[] = [
  { name: 'star', label: 'Star', Icon: Star },
  { name: 'check', label: 'Check', Icon: Check },
  { name: 'heart', label: 'Heart', Icon: Heart },
  { name: 'award', label: 'Award', Icon: Award },
  { name: 'shield', label: 'Shield', Icon: Shield },
  { name: 'flag', label: 'Flag', Icon: Flag },
  { name: 'badge-check', label: 'Badge', Icon: BadgeCheck },
  { name: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { name: 'thumbs-up', label: 'Thumbs up', Icon: ThumbsUp },
  { name: 'gift', label: 'Gift', Icon: Gift },
]

export function iconToSvgDataUrl(Icon: LucideIcon, color: string): string | null {
  const markup = renderToStaticMarkup(
    createElement(Icon, { color, strokeWidth: 1.75, width: 24, height: 24 }),
  )
  const cleaned = sanitizeSvgString(markup)
  if (!cleaned) return null
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleaned)))}`
}
