import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cell } from './Cell'

const baseCellState = { value: 0 as const, given: false, conflict: false }

describe('Cell', () => {
  it('renders empty when value is 0', () => {
    render(
      <Cell cellState={baseCellState} row={0} col={0}
        isSelected={false} isPeer={false} isSameDigit={false} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button').textContent).toBe('')
  })

  it('renders the digit when value is non-zero', () => {
    render(
      <Cell cellState={{ ...baseCellState, value: 7 }} row={0} col={0}
        isSelected={false} isPeer={false} isSameDigit={false} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button')).toHaveTextContent('7')
  })

  it('calls onSelect with row and col when clicked', async () => {
    const onSelect = vi.fn()
    render(
      <Cell cellState={baseCellState} row={2} col={5}
        isSelected={false} isPeer={false} isSameDigit={false} onSelect={onSelect} />
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(2, 5)
  })

  it('has data-selected attribute when selected', () => {
    render(
      <Cell cellState={baseCellState} row={0} col={0}
        isSelected={true} isPeer={false} isSameDigit={false} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-selected', 'true')
  })

  it('has data-given attribute for given cells', () => {
    render(
      <Cell cellState={{ ...baseCellState, given: true, value: 5 }} row={0} col={0}
        isSelected={false} isPeer={false} isSameDigit={false} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-given', 'true')
  })

  it('has data-conflict attribute for conflicting cells', () => {
    render(
      <Cell cellState={{ ...baseCellState, conflict: true, value: 3 }} row={0} col={0}
        isSelected={false} isPeer={false} isSameDigit={false} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-conflict', 'true')
  })

  it('has data-peer attribute for peer cells', () => {
    render(
      <Cell cellState={baseCellState} row={0} col={0}
        isSelected={false} isPeer={true} isSameDigit={false} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-peer', 'true')
  })

  it('has data-same-digit attribute for same-digit cells', () => {
    render(
      <Cell cellState={{ ...baseCellState, value: 4 }} row={0} col={0}
        isSelected={false} isPeer={false} isSameDigit={true} onSelect={vi.fn()} />
    )
    expect(screen.getByRole('button')).toHaveAttribute('data-same-digit', 'true')
  })
})
