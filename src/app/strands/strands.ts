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
  location: LetterLocation;
}

export interface LetterLocation {
  x: number;
  y: number;
}

export interface Solution {
  locations: LetterLocation[];
  isSuperSolution: boolean;
}

export enum MouseAction {
  Down,
  Up,
  Move,
  Click
}
