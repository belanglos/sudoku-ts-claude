import { describe, it, expect } from 'vitest'
import { solve, countSolutions, isValidPlacement } from './solver'
import type { Board } from '../types'

// A known valid puzzle and its solution
const KNOWN_PUZZLE: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

const KNOWN_SOLUTION: Board = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
]

// Genuinely unsolvable: row 0 needs a 9 at (0,8), but 9 is in box 2 at (1,6)
const UNSOLVABLE_PUZZLE: Board = [
  [1, 2, 3, 4, 5, 6, 7, 8, 0], // (0,8) must be 9
  [0, 0, 0, 0, 0, 0, 9, 0, 0], // 9 in box 2 → (0,8) can never be 9
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

describe('solve', () => {
  it('solves a known valid puzzle correctly', () => {
    const result = solve(KNOWN_PUZZLE)
    expect(result).toEqual(KNOWN_SOLUTION)
  })

  it('returns null for an unsolvable puzzle', () => {
    expect(solve(UNSOLVABLE_PUZZLE)).toBeNull()
  })

  it('does not mutate the input board', () => {
    const input = KNOWN_PUZZLE.map(row => [...row])
    solve(input)
    expect(input).toEqual(KNOWN_PUZZLE)
  })

  it('returns a fully filled board with no zeros', () => {
    const result = solve(KNOWN_PUZZLE)
    expect(result?.every(row => row.every(v => v !== 0))).toBe(true)
  })
})

describe('isValidPlacement', () => {
  const empty: Board = Array.from({ length: 9 }, () => Array(9).fill(0))

  it('allows any digit on an empty board', () => {
    expect(isValidPlacement(empty, 0, 0, 5)).toBe(true)
  })

  it('rejects a digit already in the same row', () => {
    const board = empty.map(r => [...r])
    board[0][3] = 5
    expect(isValidPlacement(board, 0, 0, 5)).toBe(false)
  })

  it('rejects a digit already in the same column', () => {
    const board = empty.map(r => [...r])
    board[3][0] = 5
    expect(isValidPlacement(board, 0, 0, 5)).toBe(false)
  })

  it('rejects a digit already in the same 3x3 box', () => {
    const board = empty.map(r => [...r])
    board[1][1] = 5
    expect(isValidPlacement(board, 0, 0, 5)).toBe(false)
  })

  it('allows the same digit if only at the target cell itself', () => {
    // When checking during generation, the cell being placed is still 0
    const board = empty.map(r => [...r])
    board[0][0] = 0
    expect(isValidPlacement(board, 0, 0, 7)).toBe(true)
  })
})

describe('countSolutions', () => {
  it('returns 1 for a puzzle with a unique solution', () => {
    expect(countSolutions(KNOWN_PUZZLE, 2)).toBe(1)
  })

  it('returns 0 for an unsolvable puzzle', () => {
    expect(countSolutions(UNSOLVABLE_PUZZLE, 2)).toBe(0)
  })

  it('returns at least 2 for an ambiguous board (all empty)', () => {
    const emptyBoard: Board = Array.from({ length: 9 }, () => Array(9).fill(0))
    expect(countSolutions(emptyBoard, 2)).toBeGreaterThanOrEqual(2)
  })

  it('stops counting at the given limit', () => {
    // An empty board has many solutions; verify it stops at limit=2
    const emptyBoard: Board = Array.from({ length: 9 }, () => Array(9).fill(0))
    const count = countSolutions(emptyBoard, 2)
    expect(count).toBeLessThanOrEqual(2)
  })
})
