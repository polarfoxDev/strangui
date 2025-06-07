export interface Connection {
  from: LetterLocation;
  to: LetterLocation;
  isGuessActive: boolean;
  isSolutionActive: boolean;
  isSuperSolutionActive: boolean;
}

export interface Letter {
  letter: string;
  isGuessActive: boolean;
  isSolutionActive: boolean;
  isSuperSolutionActive: boolean;
  hintTiming: number;
  hintFoundDelay: number;
  location: LetterLocation;
}

export interface LetterLocation {
  row: number;
  col: number;
}

export enum GameEvent {
  SolutionFound,
  SuperSolutionFound,
  HintUsed,
}

export interface Solution extends SolutionConfig {
  found: boolean;
}

export interface SolutionConfig {
  locations: LetterLocation[];
  isSuperSolution: boolean;
}

export interface RiddleConfigV2 {
  configVersion: 2;
  theme: string;
  letters: string[][];
  solutions: {
    locations: {
      x: number;
      y: number;
    }[];
    isSuperSolution: boolean;
  }[];
}

export interface RiddleConfig {
  configVersion: 3;
  theme: string;
  letters: string[][];
  solutions: SolutionConfig[];
}

export type RiddleConfigUnknownVersion = RiddleConfigV2 | RiddleConfig;

export enum MouseAction {
  Down,
  Up,
  Move,
  Click,
}

export enum GameStatus {
  NotAvailable,
  NotStarted,
  InProgress,
  Finished,
}

export interface GameStateV1 {
  solutionStates: Solution[];
  nonSolutionWordsFound: string[];
  tipsUsed: number;
  gameEvents: GameEvent[];
  activeHint: Solution | null;
  activeHintInAnimation: boolean;
  fixedConnections: Connection[];
  letterStates: Letter[];
}

export interface GameState {
  solutionStates: Solution[];
  nonSolutionWordsFound: string[];
  tipsUsed: number;
  gameEvents: GameEvent[];
  activeHintIndex: number | null;
  activeHintInAnimation: boolean;
  fixedConnections: Connection[];
  tryConnections: Connection[];
  currentTry: LetterLocation[];
  letterStates: Letter[];
  theme: string;
  statusText: string;
  statusColor: string;
  date: string;
  readonly: boolean;
}

export interface PersistentGameState {
  id: string;
  lastChanged: string;
  gameState: GameState;
}
