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
  location: LetterLocation;
}

export interface LetterLocation {
  x: number;
  y: number;
}

export interface Solution extends SolutionConfig {
  found: boolean;
}

export interface SolutionConfig {
  locations: LetterLocation[];
  isSuperSolution: boolean;
}

export interface RiddleConfig {
  index: number;
  theme: string;
  letters: string[][];
  solutions: SolutionConfig[];
}

export enum MouseAction {
  Down,
  Up,
  Move,
  Click
}
