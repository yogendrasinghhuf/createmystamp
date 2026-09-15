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

let measurementSvg: SVGSVGElement | null = null
let measurementText: SVGTextElement | null = null

// A hidden, offscreen <text> used purely to ask the browser for the real
// rendered length of a string at a given font/letter-spacing -- far more
// accurate than a fixed per-character estimate, which either clips text
// (underestimates) or blocks spacing the arc could actually fit
// (overestimates).
function getMeasurementText(): SVGTextElement {
  if (measurementText) return measurementText
  measurementSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  measurementSvg.style.position = 'absolute'
  measurementSvg.style.visibility = 'hidden'
  measurementSvg.style.pointerEvents = 'none'
  measurementText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  measurementSvg.appendChild(measurementText)
  document.body.appendChild(measurementSvg)
  return measurementText
}

function measureTextLength(
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  letterSpacing: number,
): number {
  if (typeof document === 'undefined') return text.length * fontSize * 0.6 + (text.length - 1) * letterSpacing
  const el = getMeasurementText()
  el.setAttribute('font-family', fontFamily)
  el.setAttribute('font-size', String(fontSize))
  el.setAttribute('font-weight', String(fontWeight))
  el.setAttribute('letter-spacing', String(letterSpacing))
  el.textContent = text
  return el.getComputedTextLength()
}

// Caps letter spacing so the text's actual rendered arc-length never exceeds
// the path it's drawn along -- otherwise <textPath> silently clips whatever
// doesn't fit, with no visual warning. Measures real text length in the
// browser (accounting for the real font's per-character widths) rather than
// a fixed estimate, then solves for the letter-spacing that uses the full
// available arc.
export function maxCurvedTextLetterSpacing(
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  radius: number,
): number {
  const n = text.length
  if (n <= 1) return 10
  const arcBudget = radius * degToRad(CURVED_TEXT_SWEEP_DEG) * 0.98 // tiny safety margin
  // letter-spacing adds (n-1) times its value to the base (0-spacing) length
  const baseLength = measureTextLength(text, fontFamily, fontSize, fontWeight, 0)
  const maxSpacing = (arcBudget - baseLength) / (n - 1)
  return Math.max(-2, Math.min(10, Math.round(maxSpacing * 10) / 10))
}
