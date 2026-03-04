import { Cell } from '../Cell/Cell'
import type { BoardState } from '../../types'
import styles from './Board.module.css'

interface BoardProps {
  board: BoardState
  selectedCell: [number, number] | null
  onSelect: (row: number, col: number) => void
  won?: boolean
}

function isPeer(r: number, c: number, sr: number, sc: number): boolean {
  if (r === sr && c === sc) return false
  return (
    r === sr ||
    c === sc ||
    (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3))
  )
}

export function Board({ board, selectedCell, onSelect, won = false }: BoardProps) {
  const [sr, sc] = selectedCell ?? [-1, -1]
  const selectedValue = selectedCell ? board[sr][sc].value : 0

  return (
    <div className={`${styles.board}${won ? ` ${styles.boardWon}` : ''}`} role="grid">
      {board.map((row, r) =>
        row.map((cellState, c) => (
          <Cell
            key={`${r}-${c}`}
            cellState={cellState}
            row={r}
            col={c}
            isSelected={r === sr && c === sc}
            isPeer={selectedCell !== null && isPeer(r, c, sr, sc)}
            isSameDigit={
              selectedValue !== 0 &&
              cellState.value === selectedValue &&
              !(r === sr && c === sc)
            }
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  )
}
