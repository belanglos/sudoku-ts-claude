import { describe, it, expect, beforeEach } from 'vitest'
import { saveState, loadSavedState, STORAGE_KEY } from './usePersistence'
import type { GameState, BoardState } from '../types'

function makeState(): GameState {
  const board: BoardState = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: 0 as const, given: false, conflict: false }))
  )
  return {
    board,
    solution: Array.from({ length: 9 }, () => Array(9).fill(1)) as GameState['solution'],
    history: [],
    selectedCell: null,
    difficulty: 'medium',
    status: 'playing',
  }
}

describe('saveState / loadSavedState', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and reloads a game state', () => {
    const state = makeState()
    saveState(state)
    const loaded = loadSavedState()
    expect(loaded?.difficulty).toBe('medium')
    expect(loaded?.status).toBe('playing')
  })

  it('includes a version field in the saved JSON', () => {
    saveState(makeState())
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.v).toBeDefined()
  })

  it('returns null when nothing is saved', () => {
    expect(loadSavedState()).toBeNull()
  })

  it('returns null when stored JSON is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    expect(loadSavedState()).toBeNull()
  })

  it('returns null when stored state has wrong schema (missing fields)', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, foo: 'bar' }))
    expect(loadSavedState()).toBeNull()
  })
})
