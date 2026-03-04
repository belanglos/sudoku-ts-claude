import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberPad } from './NumberPad'

describe('NumberPad', () => {
  it('renders buttons 1-9 and an Erase button', () => {
    render(<NumberPad onDigit={vi.fn()} onErase={vi.fn()} onUndo={vi.fn()} />)
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: /erase/i })).toBeInTheDocument()
  })

  it('calls onDigit with the correct value when a digit button is clicked', async () => {
    const onDigit = vi.fn()
    render(<NumberPad onDigit={onDigit} onErase={vi.fn()} onUndo={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: '5' }))
    expect(onDigit).toHaveBeenCalledWith(5)
  })

  it('calls onErase when the Erase button is clicked', async () => {
    const onErase = vi.fn()
    render(<NumberPad onDigit={vi.fn()} onErase={onErase} onUndo={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /erase/i }))
    expect(onErase).toHaveBeenCalled()
  })

  it('calls onUndo when the Undo button is clicked', async () => {
    const onUndo = vi.fn()
    render(<NumberPad onDigit={vi.fn()} onErase={vi.fn()} onUndo={onUndo} />)
    await userEvent.click(screen.getByRole('button', { name: /undo/i }))
    expect(onUndo).toHaveBeenCalled()
  })
})
