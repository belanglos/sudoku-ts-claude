export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 0 = empty
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Board = CellValue[][]; // 9x9

export interface CellState {
  value: CellValue;
  given: boolean;    // pre-filled clue; cannot be edited
  conflict: boolean; // same digit exists in row/col/box
}

export type BoardState = CellState[][];

export interface GameState {
  board: BoardState;                   // 9x9 live state
  solution: Board;                     // reference for win detection
  history: BoardState[];               // undo stack
  selectedCell: [number, number] | null;
  difficulty: Difficulty;
  status: 'idle' | 'playing' | 'won';
}

export type GameAction =
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_DIGIT'; digit: CellValue }
  | { type: 'ERASE_CELL' }
  | { type: 'UNDO' }
  | { type: 'LOAD_SAVED'; state: GameState };
