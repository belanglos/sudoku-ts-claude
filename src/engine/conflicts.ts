import type { Board, BoardState } from '../types'

// Returns a set of "row,col" keys for all cells that conflict with another
// cell in the same row, column, or 3x3 box.
export function findConflicts(board: Board): Set<string> {
  const conflicts = new Set<string>()

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c]
      if (v === 0) continue

      // Check rest of row
      for (let cc = c + 1; cc < 9; cc++) {
        if (board[r][cc] === v) {
          conflicts.add(`${r},${c}`)
          conflicts.add(`${r},${cc}`)
        }
      }

      // Check rest of column
      for (let rr = r + 1; rr < 9; rr++) {
        if (board[rr][c] === v) {
          conflicts.add(`${r},${c}`)
          conflicts.add(`${rr},${c}`)
        }
      }

      // Check rest of box (only cells not yet visited)
      const boxRow = Math.floor(r / 3) * 3
      const boxCol = Math.floor(c / 3) * 3
      for (let rr = boxRow; rr < boxRow + 3; rr++) {
        for (let cc = boxCol; cc < boxCol + 3; cc++) {
          if (rr === r && cc <= c) continue // already compared
          if (rr < r) continue
          if (board[rr][cc] === v) {
            conflicts.add(`${r},${c}`)
            conflicts.add(`${rr},${cc}`)
          }
        }
      }
    }
  }

  return conflicts
}

// Returns a new BoardState with conflict flags set based on current values
export function applyConflicts(board: BoardState): BoardState {
  const values: Board = board.map(row => row.map(cell => cell.value)) as Board
  const conflictSet = findConflicts(values)
  return board.map((row, r) =>
    row.map((cell, c) => ({
      ...cell,
      conflict: conflictSet.has(`${r},${c}`),
    }))
  )
}
