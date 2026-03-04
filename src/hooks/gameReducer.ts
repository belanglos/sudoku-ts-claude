import type { GameState, GameAction, BoardState, CellValue } from '../types'
import { generatePuzzle } from '../engine/generator'
import { applyConflicts } from '../engine/conflicts'

export const initialState: GameState = {
  board: Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: 0 as CellValue, given: false, conflict: false }))
  ) as BoardState,
  solution: Array.from({ length: 9 }, () => Array(9).fill(0)) as GameState['solution'],
  history: [],
  selectedCell: null,
  difficulty: 'easy',
  status: 'idle',
}

function buildBoardState(puzzle: GameState['solution']): BoardState {
  return puzzle.map(row =>
    row.map(v => ({ value: v as CellValue, given: v !== 0, conflict: false }))
  ) as BoardState
}

function isSolved(board: BoardState, solution: GameState['solution']): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value !== solution[r][c]) return false
    }
  }
  return true
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const { puzzle, solution } = generatePuzzle(action.difficulty)
      return {
        ...state,
        board: buildBoardState(puzzle),
        solution,
        history: [],
        selectedCell: null,
        difficulty: action.difficulty,
        status: 'playing',
      }
    }

    case 'SELECT_CELL': {
      if (state.status !== 'playing') return state
      return { ...state, selectedCell: [action.row, action.col] }
    }

    case 'INPUT_DIGIT': {
      const { selectedCell, board, solution } = state
      if (!selectedCell || state.status !== 'playing') return state
      const [r, c] = selectedCell
      if (board[r][c].given) return state

      const newBoard: BoardState = board.map(row => row.map(cell => ({ ...cell })))
      newBoard[r][c] = { ...newBoard[r][c], value: action.digit }
      const withConflicts = applyConflicts(newBoard)
      const won = isSolved(withConflicts, solution)

      return {
        ...state,
        board: withConflicts,
        history: [...state.history, board],
        status: won ? 'won' : 'playing',
      }
    }

    case 'ERASE_CELL': {
      const { selectedCell, board } = state
      if (!selectedCell || state.status !== 'playing') return state
      const [r, c] = selectedCell
      if (board[r][c].given) return state

      const newBoard: BoardState = board.map(row => row.map(cell => ({ ...cell })))
      newBoard[r][c] = { ...newBoard[r][c], value: 0 }
      const withConflicts = applyConflicts(newBoard)

      return {
        ...state,
        board: withConflicts,
        history: [...state.history, board],
      }
    }

    case 'UNDO': {
      if (state.history.length === 0) return state
      const previous = state.history[state.history.length - 1]
      return {
        ...state,
        board: previous,
        history: state.history.slice(0, -1),
        status: 'playing',
      }
    }

    case 'LOAD_SAVED': {
      return action.state
    }
  }
}
