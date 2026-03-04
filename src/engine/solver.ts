import type { Board } from '../types'

export function isValidPlacement(board: Board, row: number, col: number, digit: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === digit) return false
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === digit) return false
  }
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === digit) return false
    }
  }
  return true
}

// Returns a solved copy of the board, or null if unsolvable
export function solve(board: Board): Board | null {
  const copy = board.map(row => [...row]) as Board
  return backtrack(copy) ? copy : null
}

function backtrack(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let digit = 1; digit <= 9; digit++) {
          if (isValidPlacement(board, r, c, digit)) {
            board[r][c] = digit as Board[0][0]
            if (backtrack(board)) return true
            board[r][c] = 0
          }
        }
        return false // no valid digit found
      }
    }
  }
  return true // all cells filled
}

// Count solutions up to `limit`; stops early once limit is reached
export function countSolutions(board: Board, limit: number): number {
  const copy = board.map(row => [...row]) as Board
  const ref = { count: 0 }
  countBacktrack(copy, limit, ref)
  return ref.count
}

function countBacktrack(board: Board, limit: number, ref: { count: number }): void {
  if (ref.count >= limit) return
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let digit = 1; digit <= 9; digit++) {
          if (ref.count >= limit) return
          if (isValidPlacement(board, r, c, digit)) {
            board[r][c] = digit as Board[0][0]
            countBacktrack(board, limit, ref)
            board[r][c] = 0
          }
        }
        return
      }
    }
  }
  ref.count++
}
