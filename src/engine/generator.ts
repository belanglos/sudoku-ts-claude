import type { Board, Difficulty } from '../types'
import { solve, countSolutions, isValidPlacement } from './solver'

const CLUE_TARGETS: Record<Difficulty, number> = {
  easy:   44,
  medium: 34,
  hard:   29,
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function emptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0)) as Board
}

// Fill one 3x3 diagonal box with shuffled digits 1-9
function fillBox(board: Board, startRow: number, startCol: number): void {
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  let i = 0
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      board[r][c] = digits[i++] as Board[0][0]
    }
  }
}

function buildFilledBoard(): Board {
  const board = emptyBoard()
  // The three diagonal boxes are independent — fill them randomly
  fillBox(board, 0, 0)
  fillBox(board, 3, 3)
  fillBox(board, 6, 6)
  // Solve the rest deterministically
  const solved = solve(board)
  if (!solved) throw new Error('Failed to generate a filled board')
  return solved
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution = buildFilledBoard()
  const puzzle = solution.map(row => [...row]) as Board

  const target = CLUE_TARGETS[difficulty]
  const totalCells = 81
  const cellsToRemove = totalCells - target

  // Shuffle removal order
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  )

  let removed = 0
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break
    const saved = puzzle[r][c]
    puzzle[r][c] = 0
    if (countSolutions(puzzle, 2) === 1) {
      removed++
    } else {
      puzzle[r][c] = saved // restore — would make puzzle ambiguous
    }
  }

  return { puzzle, solution }
}

export { isValidPlacement }
