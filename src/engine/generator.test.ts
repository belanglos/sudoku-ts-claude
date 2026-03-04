import { describe, it, expect } from 'vitest'
import { generatePuzzle } from './generator'
import { countSolutions } from './solver'
import type { Difficulty } from '../types'

const CLUE_RANGES: Record<Difficulty, [number, number]> = {
  easy:   [42, 46],
  medium: [32, 36],
  hard:   [27, 31],
}

describe('generatePuzzle', () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

  difficulties.forEach(difficulty => {
    describe(`difficulty: ${difficulty}`, () => {
      // Generate once and share across tests in this block to keep suite fast
      const { puzzle, solution } = generatePuzzle(difficulty)

      it('returns a 9x9 puzzle board', () => {
        expect(puzzle).toHaveLength(9)
        puzzle.forEach(row => expect(row).toHaveLength(9))
      })

      it('returns a 9x9 solution board', () => {
        expect(solution).toHaveLength(9)
        solution.forEach(row => expect(row).toHaveLength(9))
      })

      it('solution has no zeros', () => {
        solution.forEach(row => row.forEach(v => expect(v).not.toBe(0)))
      })

      it(`has the right number of clues for ${difficulty}`, () => {
        const [min, max] = CLUE_RANGES[difficulty]
        const clues = puzzle.flat().filter(v => v !== 0).length
        expect(clues).toBeGreaterThanOrEqual(min)
        expect(clues).toBeLessThanOrEqual(max)
      })

      it('puzzle has exactly one solution', () => {
        expect(countSolutions(puzzle, 2)).toBe(1)
      })

      it('given cells in puzzle match the solution', () => {
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (puzzle[r][c] !== 0) {
              expect(puzzle[r][c]).toBe(solution[r][c])
            }
          }
        }
      })
    })
  })
})
