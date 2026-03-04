import { useGameState } from './hooks/useGameState'
import { Board } from './components/Board/Board'
import { NumberPad } from './components/NumberPad/NumberPad'
import { Controls } from './components/Controls/Controls'
import styles from './App.module.css'

export default function App() {
  const { state, newGame, selectCell, inputDigit, erase, undo } = useGameState()

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Sudoku</h1>

      <Controls difficulty={state.difficulty} onNewGame={newGame} />

      {state.status === 'idle' && (
        <p className={styles.prompt}>Select a difficulty and press New Game to start.</p>
      )}

      {state.status !== 'idle' && (
        <>
          <Board
            board={state.board}
            selectedCell={state.selectedCell}
            onSelect={selectCell}
            won={state.status === 'won'}
          />
          <NumberPad onDigit={inputDigit} onErase={erase} onUndo={undo} />
        </>
      )}

      {state.status === 'won' && (
        <div className={styles.winBanner}>
          <span className={styles.winTitle}>Puzzle solved!</span>
          <span className={styles.winDifficulty}>{state.difficulty}</span>
          <button className={styles.winNewGame} onClick={() => newGame(state.difficulty)}>
            Play again
          </button>
        </div>
      )}
    </div>
  )
}
