import { GameState, Letter, LetterLocation } from "./models";

const AUTO_TEXT_COLOR = 'light-dark(var(--dark-text), var(--light-text))';
export const AUTO_TEXT_COLOR_SOLUTION = 'light-dark(var(--solution), var(--solution-brighter))';
export const AUTO_TEXT_COLOR_SUPER_SOLUTION = 'light-dark(var(--super-solution), var(--super-solution-brighter))';

export const letterAt = (letterStates: Letter[], location: LetterLocation): Letter => {
  return letterStates.find(l => l.location.row === location.row && l.location.col === location.col)!;
}

export const getSolutionCompareString = (letterStates: Letter[], letterLocations: LetterLocation[]): string => {
  const printedWord = letterLocations.map(loc => letterAt(letterStates, loc)).map(l => l.letter).join('');
  const sortedLetterLocations = [...letterLocations].sort((a, b) => a.row - b.row || a.col - b.col);
  const compareString = JSON.stringify([printedWord, sortedLetterLocations]);
  return compareString;
}

export const status = (text: string, color: string = AUTO_TEXT_COLOR): Partial<GameState> => ({
  statusText: text,
  statusColor: color,
})
