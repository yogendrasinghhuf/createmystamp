export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

const MAX_HISTORY = 50

export function pushHistory<T>(history: HistoryState<T>, next: T): HistoryState<T> {
  return {
    past: [...history.past, history.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
  }
}

export function undoHistory<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.past.length === 0) return history
  const previous = history.past[history.past.length - 1]
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  }
}

export function redoHistory<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.future.length === 0) return history
  const next = history.future[0]
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
  }
}
