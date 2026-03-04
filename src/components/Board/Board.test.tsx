import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Board } from './Board'
import type { BoardState } from '../../types'

function makeBoard(values: number[][]): BoardState {
  return values.map(row =>
    row.map(v => ({ value: v as BoardState[0][0]['value'], given: v !== 0, conflict: false }))
  )
}

const emptyBoard = makeBoard(Array.from({ length: 9 }, () => Array(9).fill(0)))

describe('Board', () => {
  it('renders 81 cells', () => {
    render(<Board board={emptyBoard} selectedCell={null} onSelect={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(81)
  })

  it('calls onSelect with correct row/col when a cell is clicked', async () => {
    const onSelect = vi.fn()
    render(<Board board={emptyBoard} selectedCell={null} onSelect={onSelect} />)
    const cells = screen.getAllByRole('button')
    // Cell at index r*9+c for (r,c)
    await userEvent.click(cells[3 * 9 + 5]) // row 3, col 5
    expect(onSelect).toHaveBeenCalledWith(3, 5)
  })

  it('marks the selected cell', () => {
    render(<Board board={emptyBoard} selectedCell={[1, 2]} onSelect={vi.fn()} />)
    const cells = screen.getAllByRole('button')
    expect(cells[1 * 9 + 2]).toHaveAttribute('data-selected', 'true')
  })

  it('marks peer cells (same row/col/box as selected)', () => {
    render(<Board board={emptyBoard} selectedCell={[0, 0]} onSelect={vi.fn()} />)
    const cells = screen.getAllByRole('button')
    // Same row: (0,1) through (0,8)
    expect(cells[0 * 9 + 1]).toHaveAttribute('data-peer', 'true')
    // Same col: (1,0) through (8,0)
    expect(cells[1 * 9 + 0]).toHaveAttribute('data-peer', 'true')
    // Same box: (1,1), (2,2) etc.
    expect(cells[1 * 9 + 1]).toHaveAttribute('data-peer', 'true')
  })
})
