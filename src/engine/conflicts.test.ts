import { describe, it, expect } from 'vitest'
import { findConflicts, applyConflicts } from './conflicts'
import type { Board, BoardState } from '../types'

function makeBoard(values: number[][]): Board {
  return values as Board
}

function makeBoardState(values: number[][]): BoardState {
  return values.map(row =>
    row.map(v => ({ value: v as BoardState[0][0]['value'], given: false, conflict: false }))
  )
}

describe('findConflicts', () => {
  it('returns empty set for an empty board', () => {
    const board = makeBoard(Array.from({ length: 9 }, () => Array(9).fill(0)))
    expect(findConflicts(board).size).toBe(0)
  })

  it('returns empty set for a correct (non-conflicting) board', () => {
    const board = makeBoard([
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ])
    expect(findConflicts(board).size).toBe(0)
  })

  it('detects a row duplicate — both cells flagged', () => {
    const board = makeBoard(Array.from({ length: 9 }, () => Array(9).fill(0)))
    board[0][0] = 5
    board[0][5] = 5 // same row, same digit
    const conflicts = findConflicts(board)
    expect(conflicts.has('0,0')).toBe(true)
    expect(conflicts.has('0,5')).toBe(true)
    expect(conflicts.size).toBe(2)
  })

  it('detects a column duplicate — both cells flagged', () => {
    const board = makeBoard(Array.from({ length: 9 }, () => Array(9).fill(0)))
    board[1][3] = 7
    board[5][3] = 7 // same col, same digit
    const conflicts = findConflicts(board)
    expect(conflicts.has('1,3')).toBe(true)
    expect(conflicts.has('5,3')).toBe(true)
    expect(conflicts.size).toBe(2)
  })

  it('detects a box duplicate — both cells flagged', () => {
    const board = makeBoard(Array.from({ length: 9 }, () => Array(9).fill(0)))
    board[3][3] = 4 // top-left of center box
    board[5][5] = 4 // bottom-right of center box
    const conflicts = findConflicts(board)
    expect(conflicts.has('3,3')).toBe(true)
    expect(conflicts.has('5,5')).toBe(true)
    expect(conflicts.size).toBe(2)
  })

  it('does not flag zeros', () => {
    const board = makeBoard(Array.from({ length: 9 }, () => Array(9).fill(0)))
    // Even with many zeros, no conflicts
    expect(findConflicts(board).size).toBe(0)
  })
})

describe('applyConflicts', () => {
  it('sets conflict=true only on conflicting cells', () => {
    const boardState = makeBoardState(Array.from({ length: 9 }, () => Array(9).fill(0)))
    boardState[0][0].value = 3
    boardState[0][8].value = 3 // row conflict

    const result = applyConflicts(boardState)
    expect(result[0][0].conflict).toBe(true)
    expect(result[0][8].conflict).toBe(true)
    expect(result[1][0].conflict).toBe(false)
  })

  it('does not mutate the input board', () => {
    const boardState = makeBoardState(Array.from({ length: 9 }, () => Array(9).fill(0)))
    boardState[0][0].value = 5
    boardState[0][1].value = 5
    applyConflicts(boardState)
    expect(boardState[0][0].conflict).toBe(false)
  })

  it('returns a new board reference', () => {
    const boardState = makeBoardState(Array.from({ length: 9 }, () => Array(9).fill(0)))
    const result = applyConflicts(boardState)
    expect(result).not.toBe(boardState)
  })
})
