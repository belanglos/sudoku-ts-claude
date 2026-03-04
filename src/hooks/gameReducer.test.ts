import { describe, it, expect } from 'vitest'
import { gameReducer, initialState } from './gameReducer'
import type { GameState, BoardState } from '../types'

// Build a minimal valid GameState for testing
function makePlayingState(overrides: Partial<GameState> = {}): GameState {
  const solution = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => (((r * 3 + Math.floor(r / 3) + c) % 9) + 1)) as number[]
  ) as GameState['solution']

  const board: BoardState = solution.map((row, r) =>
    row.map((v, c) => ({
      value: (r === 0 && c === 0) ? 0 : v,  // leave (0,0) empty for tests
      given: !(r === 0 && c === 0),
      conflict: false,
    }))
  ) as BoardState

  return {
    board,
    solution,
    history: [],
    selectedCell: null,
    difficulty: 'easy',
    status: 'playing',
    ...overrides,
  }
}

describe('gameReducer — initial state', () => {
  it('starts with status idle', () => {
    expect(initialState.status).toBe('idle')
  })
})

describe('gameReducer — NEW_GAME', () => {
  it('sets status to playing', () => {
    const next = gameReducer(initialState, { type: 'NEW_GAME', difficulty: 'easy' })
    expect(next.status).toBe('playing')
  })

  it('sets difficulty', () => {
    const next = gameReducer(initialState, { type: 'NEW_GAME', difficulty: 'hard' })
    expect(next.difficulty).toBe('hard')
  })

  it('clears history', () => {
    const stateWithHistory: GameState = { ...makePlayingState(), history: [[]] }
    const next = gameReducer(stateWithHistory, { type: 'NEW_GAME', difficulty: 'easy' })
    expect(next.history).toHaveLength(0)
  })

  it('clears selectedCell', () => {
    const state = makePlayingState({ selectedCell: [0, 0] })
    const next = gameReducer(state, { type: 'NEW_GAME', difficulty: 'easy' })
    expect(next.selectedCell).toBeNull()
  })

  it('generates a board with some given cells', () => {
    const next = gameReducer(initialState, { type: 'NEW_GAME', difficulty: 'easy' })
    const givens = next.board.flat().filter(c => c.given).length
    expect(givens).toBeGreaterThan(0)
  })
})

describe('gameReducer — SELECT_CELL', () => {
  it('sets selectedCell', () => {
    const state = makePlayingState()
    const next = gameReducer(state, { type: 'SELECT_CELL', row: 3, col: 4 })
    expect(next.selectedCell).toEqual([3, 4])
  })

  it('does nothing when status is idle', () => {
    const next = gameReducer(initialState, { type: 'SELECT_CELL', row: 0, col: 0 })
    expect(next.selectedCell).toBeNull()
  })
})

describe('gameReducer — INPUT_DIGIT', () => {
  it('does nothing when no cell is selected', () => {
    const state = makePlayingState({ selectedCell: null })
    const next = gameReducer(state, { type: 'INPUT_DIGIT', digit: 5 })
    expect(next.board[0][0].value).toBe(0) // (0,0) is our empty cell
  })

  it('does nothing when selected cell is a given', () => {
    const state = makePlayingState({ selectedCell: [0, 1] }) // (0,1) is given
    const original = state.board[0][1].value
    const next = gameReducer(state, { type: 'INPUT_DIGIT', digit: 9 })
    expect(next.board[0][1].value).toBe(original)
  })

  it('sets the digit on a non-given cell', () => {
    const state = makePlayingState({ selectedCell: [0, 0] })
    const next = gameReducer(state, { type: 'INPUT_DIGIT', digit: 3 })
    expect(next.board[0][0].value).toBe(3)
  })

  it('pushes current board to history before changing', () => {
    const state = makePlayingState({ selectedCell: [0, 0] })
    const next = gameReducer(state, { type: 'INPUT_DIGIT', digit: 3 })
    expect(next.history).toHaveLength(1)
    expect(next.history[0][0][0].value).toBe(0) // previous state had 0 at (0,0)
  })

  it('detects win when all cells match solution', () => {
    const solution: GameState['solution'] = Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => (((r * 3 + Math.floor(r / 3) + c) % 9) + 1))
    ) as GameState['solution']

    // Board where only (0,0) is empty and non-given; everything else matches solution
    const board: BoardState = solution.map((row, r) =>
      row.map((v, c) => ({
        value: (r === 0 && c === 0) ? 0 : v,
        given: !(r === 0 && c === 0),
        conflict: false,
      }))
    ) as BoardState

    const state: GameState = {
      board, solution, history: [], selectedCell: [0, 0], difficulty: 'easy', status: 'playing'
    }
    const correctDigit = solution[0][0]
    const next = gameReducer(state, { type: 'INPUT_DIGIT', digit: correctDigit })
    expect(next.status).toBe('won')
  })
})

describe('gameReducer — ERASE_CELL', () => {
  it('sets value to 0 on a non-given cell', () => {
    const state = makePlayingState({ selectedCell: [0, 0] })
    // First place a digit
    const withDigit = gameReducer(state, { type: 'INPUT_DIGIT', digit: 5 })
    // Then erase it (keep selection)
    const next = gameReducer({ ...withDigit, selectedCell: [0, 0] }, { type: 'ERASE_CELL' })
    expect(next.board[0][0].value).toBe(0)
  })

  it('does not erase a given cell', () => {
    const state = makePlayingState({ selectedCell: [0, 1] }) // (0,1) is given
    const original = state.board[0][1].value
    const next = gameReducer(state, { type: 'ERASE_CELL' })
    expect(next.board[0][1].value).toBe(original)
  })
})

describe('gameReducer — UNDO', () => {
  it('restores the previous board from history', () => {
    const state = makePlayingState({ selectedCell: [0, 0] })
    const afterInput = gameReducer(state, { type: 'INPUT_DIGIT', digit: 7 })
    expect(afterInput.board[0][0].value).toBe(7)
    expect(afterInput.history).toHaveLength(1)

    const afterUndo = gameReducer(afterInput, { type: 'UNDO' })
    expect(afterUndo.board[0][0].value).toBe(0)
    expect(afterUndo.history).toHaveLength(0)
  })

  it('does nothing when history is empty', () => {
    const state = makePlayingState({ history: [] })
    const next = gameReducer(state, { type: 'UNDO' })
    expect(next).toBe(state) // same reference
  })
})

describe('gameReducer — LOAD_SAVED', () => {
  it('replaces the entire state', () => {
    const saved = makePlayingState({ difficulty: 'hard', status: 'playing' })
    const next = gameReducer(initialState, { type: 'LOAD_SAVED', state: saved })
    expect(next.difficulty).toBe('hard')
    expect(next.status).toBe('playing')
  })
})
