import { useState } from 'react'
import type { Difficulty } from '../../types'
import styles from './Controls.module.css'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

interface ControlsProps {
  difficulty: Difficulty
  onNewGame: (difficulty: Difficulty) => void
}

export function Controls({ difficulty, onNewGame }: ControlsProps) {
  const [selected, setSelected] = useState<Difficulty>(difficulty)

  return (
    <div className={styles.controls}>
      <div className={styles.difficultyGroup}>
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            className={styles.diffBtn}
            data-active={selected === d || undefined}
            onClick={() => setSelected(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <button className={styles.newGame} onClick={() => onNewGame(selected)}>
        New Game
      </button>
    </div>
  )
}
