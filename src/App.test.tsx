import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import type { GameState } from './types'

vi.mock('./hooks/useGameState')
vi.mock('./hooks/useTheme', () => ({ useTheme: vi.fn() }))

import { useGameState } from './hooks/useGameState'
import { useTheme } from './hooks/useTheme'

const mockedUseGameState = vi.mocked(useGameState)
const mockedUseTheme = vi.mocked(useTheme)

const emptyBoard: GameState['board'] = Array.from({ length: 9 }, () =>
  Array.from({ length: 9 }, () => ({ value: 0 as const, given: false, conflict: false }))
)

const emptySolution = Array.from({ length: 9 }, () => Array(9).fill(0)) as GameState['solution']

function makeState(overrides: Partial<GameState>): GameState {
  return {
    board: emptyBoard,
    solution: emptySolution,
    selectedCell: null,
    history: [],
    difficulty: 'easy',
    status: 'idle',
    ...overrides,
  }
}

beforeEach(() => {
  mockedUseTheme.mockReturnValue({ theme: 'light', toggle: vi.fn() })
})

describe('App win banner', () => {
  it('renders win banner when status is won', () => {
    mockedUseGameState.mockReturnValue({
      state: makeState({ status: 'won', difficulty: 'hard' }),
      newGame: vi.fn(),
      selectCell: vi.fn(),
      inputDigit: vi.fn(),
      erase: vi.fn(),
      undo: vi.fn(),
      loadSaved: vi.fn(),
    })

    render(<App />)

    expect(screen.getByText('Puzzle solved!')).toBeInTheDocument()
    expect(screen.getByText('hard')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument()
  })

  it('does not render win banner when status is playing', () => {
    mockedUseGameState.mockReturnValue({
      state: makeState({ status: 'playing' }),
      newGame: vi.fn(),
      selectCell: vi.fn(),
      inputDigit: vi.fn(),
      erase: vi.fn(),
      undo: vi.fn(),
      loadSaved: vi.fn(),
    })

    render(<App />)

    expect(screen.queryByText('Puzzle solved!')).not.toBeInTheDocument()
  })

  it('calls newGame with the same difficulty when Play again is clicked', async () => {
    const newGame = vi.fn()
    mockedUseGameState.mockReturnValue({
      state: makeState({ status: 'won', difficulty: 'medium' }),
      newGame,
      selectCell: vi.fn(),
      inputDigit: vi.fn(),
      erase: vi.fn(),
      undo: vi.fn(),
      loadSaved: vi.fn(),
    })

    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'Play again' }))

    expect(newGame).toHaveBeenCalledWith('medium')
  })
})
