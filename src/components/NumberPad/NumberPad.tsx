import type { CellValue } from '../../types'
import styles from './NumberPad.module.css'

interface NumberPadProps {
  onDigit: (digit: CellValue) => void
  onErase: () => void
  onUndo: () => void
}

export function NumberPad({ onDigit, onErase, onUndo }: NumberPadProps) {
  return (
    <div className={styles.pad}>
      {([1, 2, 3, 4, 5, 6, 7, 8, 9] as CellValue[]).map(d => (
        <button key={d} className={styles.digit} onClick={() => onDigit(d)}>
          {d}
        </button>
      ))}
      <button className={styles.action} onClick={onErase}>Erase</button>
      <button className={styles.action} onClick={onUndo}>Undo</button>
    </div>
  )
}
