import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Controls } from './Controls'

describe('Controls', () => {
  it('renders difficulty buttons', () => {
    render(<Controls difficulty="easy" onNewGame={vi.fn()} />)
    expect(screen.getByRole('button', { name: /easy/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hard/i })).toBeInTheDocument()
  })

  it('renders a New Game button', () => {
    render(<Controls difficulty="easy" onNewGame={vi.fn()} />)
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })

  it('calls onNewGame with the selected difficulty when New Game is clicked', async () => {
    const onNewGame = vi.fn()
    render(<Controls difficulty="easy" onNewGame={onNewGame} />)
    await userEvent.click(screen.getByRole('button', { name: /medium/i }))
    await userEvent.click(screen.getByRole('button', { name: /new game/i }))
    expect(onNewGame).toHaveBeenCalledWith('medium')
  })

  it('marks the current difficulty as active', () => {
    render(<Controls difficulty="hard" onNewGame={vi.fn()} />)
    expect(screen.getByRole('button', { name: /hard/i })).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('button', { name: /easy/i })).not.toHaveAttribute('data-active')
  })
})
