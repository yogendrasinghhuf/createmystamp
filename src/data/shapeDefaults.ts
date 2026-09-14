import type { StampShapeKind, StampDimensions } from '../types/stamp'

export const SHAPE_DEFAULT_DIMENSIONS: Record<StampShapeKind, StampDimensions> = {
  circle: { width: 40, height: 40 },
  badge: { width: 40, height: 40 },
  oval: { width: 50, height: 35 },
  rectangle: { width: 60, height: 35 },
  roundedRectangle: { width: 60, height: 35 },
  triangle: { width: 50, height: 45 },
}
