import type { StampProject } from '../types/stamp'

export const STORAGE_KEY = 'markforge:project'

export function saveProject(project: StampProject): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, autosave is best-effort
  }
}

export function loadProject(): StampProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StampProject
  } catch {
    return null
  }
}

export function clearProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
