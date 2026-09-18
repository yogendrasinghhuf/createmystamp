export type StampShapeKind = 'circle' | 'oval' | 'rectangle' | 'roundedRectangle' | 'badge' | 'triangle'

export interface StampDimensions {
  width: number
  height: number
}

export interface InkSettings {
  mode: 'clean' | 'ink'
  color: string
  opacity: number
  distress: number
}

export interface ElementCommon {
  id: string
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
}

export interface TextElement extends ElementCommon {
  type: 'text'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  align: 'left' | 'center' | 'right'
  color: string
  multiline: boolean
}

export interface CurvedTextElement extends ElementCommon {
  type: 'curvedText'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  color: string
  radius: number
  startAngle: number
  direction: 'clockwise' | 'counterclockwise'
}

export type ShapeKind =
  | 'circle'
  | 'oval'
  | 'rectangle'
  | 'roundedRectangle'
  | 'line'
  | 'triangle'
  | 'star'
  | 'octagon'
  | 'x'

export interface ShapeElement extends ElementCommon {
  type: 'shape'
  shape: ShapeKind
  width: number
  height: number
  strokeColor: string
  strokeWidth: number
  // Gap between dashes, as a multiple of strokeWidth. 0 (or unset) = solid;
  // any value above 0 makes the stroke dashed, with the gap growing as this
  // increases.
  dashGap?: number
  fillColor: string
  filled: boolean
  cornerRadius?: number
}

export interface ImageElement extends ElementCommon {
  type: 'image'
  src: string
  width: number
  height: number
  isSvg: boolean
  // Present only for images created from the built-in icon picker (matches
  // StampIconOption.name in src/lib/icons.ts) -- lets the color swatch
  // regenerate `src` with a new fill instead of exposing color editing for
  // arbitrary uploaded images, which have no single recolorable fill.
  iconName?: string
  color?: string
}

export type QrContentType = 'text' | 'email' | 'telephone'

export interface QrCodeElement extends ElementCommon {
  type: 'qrCode'
  content: string
  contentType: QrContentType
  size: number
  color: string
}

export type StampElement = TextElement | CurvedTextElement | ShapeElement | ImageElement | QrCodeElement

export interface StampProject {
  id: string
  name: string
  shape: StampShapeKind
  dimensions: StampDimensions
  elements: StampElement[]
  ink: InkSettings
  updatedAt: number
  // True right after "Clear workspace" until the user explicitly sets a
  // shape/size (or loads/resets a project). Suppresses the stamp outline so
  // adding a toolbar shape to a cleared canvas doesn't silently bring back an
  // outline the user never asked for. Persisted so it survives page reloads.
  outlineSuppressed?: boolean
}
