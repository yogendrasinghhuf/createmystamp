import { create } from 'zustand'
import type { StampProject, StampElement, StampShapeKind, StampDimensions, InkSettings } from '../types/stamp'
import { uid } from '../lib/id'
import { pushHistory, undoHistory, redoHistory, type HistoryState } from '../lib/history'

export function createDefaultProject(): StampProject {
  return {
    id: uid(),
    name: 'Untitled stamp',
    shape: 'circle',
    dimensions: { width: 40, height: 40 },
    elements: [],
    ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.2 },
    updatedAt: Date.now(),
  }
}

interface StampStoreState {
  history: HistoryState<StampProject>
  selectedIds: string[]
}

export interface StampStore {
  selectedIds: string[]
  setShape: (shape: StampShapeKind) => void
  setDimensions: (dimensions: StampDimensions) => void
  setInk: (ink: Partial<InkSettings>) => void
  addElement: (element: StampElement) => void
  updateElement: (id: string, patch: Partial<StampElement>) => void
  removeElement: (id: string) => void
  duplicateElement: (id: string) => void
  reorderElement: (id: string, direction: 'up' | 'down') => void
  select: (ids: string[]) => void
  undo: () => void
  redo: () => void
  loadProject: (project: StampProject) => void
  resetProject: () => void
}

function withUpdatedProject(
  state: StampStoreState,
  mutate: (project: StampProject) => StampProject,
): Partial<StampStoreState> {
  const next = { ...mutate(state.history.present), updatedAt: Date.now() }
  return { history: pushHistory(state.history, next) }
}

export const useStampStore = create<StampStore & StampStoreState>((set) => ({
  history: { past: [], present: createDefaultProject(), future: [] },
  selectedIds: [],

  setShape: (shape) =>
    set((state) => withUpdatedProject(state, (p) => ({ ...p, shape }))),

  setDimensions: (dimensions) =>
    set((state) => withUpdatedProject(state, (p) => ({ ...p, dimensions }))),

  setInk: (ink) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({ ...p, ink: { ...p.ink, ...ink } })),
    ),

  addElement: (element) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({ ...p, elements: [...p.elements, element] })),
    ),

  updateElement: (id, patch) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({
        ...p,
        elements: p.elements.map((el) =>
          el.id === id ? ({ ...el, ...patch } as StampElement) : el,
        ),
      })),
    ),

  removeElement: (id) =>
    set((state) => ({
      ...withUpdatedProject(state, (p) => ({
        ...p,
        elements: p.elements.filter((el) => el.id !== id),
      })),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  duplicateElement: (id) =>
    set((state) =>
      withUpdatedProject(state, (p) => {
        const original = p.elements.find((el) => el.id === id)
        if (!original) return p
        const copy: StampElement = {
          ...original,
          id: uid(),
          x: original.x + 4,
          y: original.y + 4,
          zIndex: Math.max(...p.elements.map((el) => el.zIndex), 0) + 1,
        }
        return { ...p, elements: [...p.elements, copy] }
      }),
    ),

  reorderElement: (id, direction) =>
    set((state) =>
      withUpdatedProject(state, (p) => {
        const sorted = [...p.elements].sort((a, b) => a.zIndex - b.zIndex)
        const index = sorted.findIndex((el) => el.id === id)
        const swapWith = direction === 'up' ? index + 1 : index - 1
        if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return p
        const a = sorted[index]
        const b = sorted[swapWith]
        const az = a.zIndex
        const bz = b.zIndex
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id === a.id) return { ...el, zIndex: bz }
            if (el.id === b.id) return { ...el, zIndex: az }
            return el
          }),
        }
      }),
    ),

  select: (ids) => set({ selectedIds: ids }),

  undo: () => set((state) => ({ history: undoHistory(state.history), selectedIds: [] })),
  redo: () => set((state) => ({ history: redoHistory(state.history), selectedIds: [] })),

  loadProject: (project) =>
    set(() => ({ history: { past: [], present: project, future: [] }, selectedIds: [] })),

  resetProject: () =>
    set(() => ({
      history: { past: [], present: createDefaultProject(), future: [] },
      selectedIds: [],
    })),
}))

export const useProject = () => useStampStore((s) => s.history.present)
export const useCanUndo = () => useStampStore((s) => s.history.past.length > 0)
export const useCanRedo = () => useStampStore((s) => s.history.future.length > 0)
export const useSelectedIds = () => useStampStore((s) => s.selectedIds)
