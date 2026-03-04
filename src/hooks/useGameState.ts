import { useReducer, useEffect, useCallback } from 'react'
import { gameReducer, initialState } from './gameReducer'
import type { CellValue, Difficulty, GameState } from '../types'
import { loadSavedState, saveState } from './usePersistence'

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState, () => {
    const saved = loadSavedState()
    return saved ?? initialState
  })

  // Persist on every state change
  useEffect(() => {
    if (state.status !== 'idle') {
      saveState(state)
    }
  }, [state])

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state.status !== 'playing') return

    const digit = parseInt(e.key)
    if (digit >= 1 && digit <= 9) {
      dispatch({ type: 'INPUT_DIGIT', digit: digit as CellValue })
      return
    }
    if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
      dispatch({ type: 'ERASE_CELL' })
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault()
      dispatch({ type: 'UNDO' })
      return
    }
    if (state.selectedCell) {
      const [r, c] = state.selectedCell
      const moves: Record<string, [number, number]> = {
        ArrowUp:    [Math.max(0, r - 1), c],
        ArrowDown:  [Math.min(8, r + 1), c],
        ArrowLeft:  [r, Math.max(0, c - 1)],
        ArrowRight: [r, Math.min(8, c + 1)],
      }
      if (moves[e.key]) {
        e.preventDefault()
        dispatch({ type: 'SELECT_CELL', row: moves[e.key][0], col: moves[e.key][1] })
      }
    }
  }, [state.status, state.selectedCell])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    state,
    newGame: (difficulty: Difficulty) => dispatch({ type: 'NEW_GAME', difficulty }),
    selectCell: (row: number, col: number) => dispatch({ type: 'SELECT_CELL', row, col }),
    inputDigit: (digit: CellValue) => dispatch({ type: 'INPUT_DIGIT', digit }),
    erase: () => dispatch({ type: 'ERASE_CELL' }),
    undo: () => dispatch({ type: 'UNDO' }),
    loadSaved: (saved: GameState) => dispatch({ type: 'LOAD_SAVED', state: saved }),
  }
}
