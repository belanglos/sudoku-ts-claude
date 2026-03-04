import type { GameState } from '../types'

export const STORAGE_KEY = 'sudoku-game-state'
const CURRENT_VERSION = 1

interface PersistedState {
  v: number
  state: GameState
}

export function saveState(state: GameState): void {
  try {
    const payload: PersistedState = { v: CURRENT_VERSION, state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Storage might be full or unavailable — silently ignore
  }
}

export function loadSavedState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isValidPersistedState(parsed)) return null
    return parsed.state
  } catch {
    return null
  }
}

function isValidPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  if (obj.v !== CURRENT_VERSION) return false
  const state = obj.state
  if (typeof state !== 'object' || state === null) return false
  const s = state as Record<string, unknown>
  return (
    Array.isArray(s.board) &&
    Array.isArray(s.solution) &&
    Array.isArray(s.history) &&
    typeof s.difficulty === 'string' &&
    typeof s.status === 'string'
  )
}
