# Sudoku

A clean, browser-based Sudoku game built with React and TypeScript.

## Features

- **Three difficulty levels** — Easy (44 clues), Medium (34), Hard (29)
- **Unique puzzles** — every puzzle is procedurally generated and guaranteed to have exactly one solution
- **Conflict highlighting** — invalid entries are marked in red instantly
- **Undo** — step back through your moves
- **Keyboard support** — arrow keys to navigate, number keys to fill, Backspace/Delete to erase, Ctrl+Z to undo
- **Auto-save** — game state is saved to localStorage and restored on reload
- **Dark mode** — follows OS preference automatically; manual toggle in the header persists to localStorage

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) for development and bundling
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) for unit tests
- No runtime dependencies beyond React itself

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint the codebase |

## How it works

Puzzles are generated at runtime:

1. The three diagonal 3×3 boxes are filled with shuffled digits (they are mutually independent, so this is always valid).
2. A backtracking solver fills the remaining cells.
3. Cells are removed one by one in random order; each removal is only kept if the puzzle still has exactly one solution.
