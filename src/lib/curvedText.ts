// src/lib/curvedText.ts
import { degToRad } from './geometry'

export function buildCurvedTextArcPath(
  radius: number,
  startAngleDeg: number,
  direction: 'clockwise' | 'counterclockwise',
): string {
  const sweepDeg = 300 // leave a 60-degree gap so it's an open arc, not a closed loop
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
