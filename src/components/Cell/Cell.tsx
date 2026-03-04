import type { CellState } from '../../types'
import styles from './Cell.module.css'

interface CellProps {
  cellState: CellState
  row: number
  col: number
  isSelected: boolean
  isPeer: boolean
  isSameDigit: boolean
  onSelect: (row: number, col: number) => void
}

export function Cell({ cellState, row, col, isSelected, isPeer, isSameDigit, onSelect }: CellProps) {
  const { value, given, conflict } = cellState
  return (
    <button
      className={styles.cell}
      data-selected={isSelected || undefined}
      data-given={given || undefined}
      data-conflict={conflict || undefined}
      data-peer={isPeer || undefined}
      data-same-digit={isSameDigit || undefined}
      onClick={() => onSelect(row, col)}
      aria-label={`Cell row ${row + 1} column ${col + 1}${value ? ` value ${value}` : ''}`}
    >
      {value !== 0 ? value : ''}
    </button>
  )
}
