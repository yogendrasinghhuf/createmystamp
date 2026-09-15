// src/lib/curvedText.ts
import { degToRad } from './geometry'

export const CURVED_TEXT_SWEEP_DEG = 300 // leave a 60-degree gap so it's an open arc, not a closed loop

export function buildCurvedTextArcPath(
  radius: number,
  startAngleDeg: number,
  direction: 'clockwise' | 'counterclockwise',
): string {
  const sweepDeg = CURVED_TEXT_SWEEP_DEG
  const endAngleDeg =
    direction === 'clockwise' ? startAngleDeg + sweepDeg : startAngleDeg - sweepDeg

  const start = {
    x: radius * Math.cos(degToRad(startAngleDeg - 90)),
    y: radius * Math.sin(degToRad(startAngleDeg - 90)),
  }
  const end = {
    x: radius * Math.cos(degToRad(endAngleDeg - 90)),
    y: radius * Math.sin(degToRad(endAngleDeg - 90)),
  }

  const largeArcFlag = sweepDeg > 180 ? 1 : 0
  const sweepFlag = direction === 'clockwise' ? 1 : 0

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`
}

// Caps letter spacing so the text's estimated arc-length never exceeds the
// path it's drawn along -- otherwise <textPath> silently clips whatever
// doesn't fit, with no visual warning (see CanvasElementView's curvedText
// width estimate: n*fontSize*0.6 + (n-1)*letterSpacing).
export function maxCurvedTextLetterSpacing(text: string, fontSize: number, radius: number): number {
  const n = text.length
  if (n <= 1) return 10
  const arcBudget = radius * degToRad(CURVED_TEXT_SWEEP_DEG) * 0.92 // small safety margin
  const maxSpacing = (arcBudget - n * fontSize * 0.6) / (n - 1)
  return Math.max(-2, Math.min(10, Math.round(maxSpacing * 10) / 10))
}
