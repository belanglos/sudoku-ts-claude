import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// jsdom doesn't implement matchMedia — provide a controllable stub
const mockMatchMedia = vi.fn((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
Object.defineProperty(window, 'matchMedia', { writable: true, value: mockMatchMedia })

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: false, // default: OS is light
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    vi.resetModules()
  })

  it('defaults to light when OS prefers light and nothing is saved', async () => {
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('defaults to dark when OS prefers dark and nothing is saved', async () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('respects saved theme from localStorage over OS preference', async () => {
    localStorage.setItem('theme', 'dark')
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
  })

  it('toggle flips from light to dark', async () => {
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    act(() => { result.current.toggle() })
    expect(result.current.theme).toBe('dark')
  })

  it('toggle flips from dark to light', async () => {
    localStorage.setItem('theme', 'dark')
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    expect(result.current.theme).toBe('light')
  })

  it('toggle persists the new theme to localStorage', async () => {
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggle updates data-theme on the document root', async () => {
    const { useTheme } = await import('./useTheme')
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
