import { createReducer, on } from '@ngrx/store';
import { AUTO_TEXT_COLOR_SOLUTION, AUTO_TEXT_COLOR_SUPER_SOLUTION, getSolutionCompareString, letterAt, status } from '@game/strands.helpers';
import { GameEvent, GameState } from '../models';
import * as Action from './strands.actions';
import { initialState } from './strands.state';

export const reducer = createReducer(
  initialState,
  on(Action.loadExistingGame, (_state, { gameState }) => {
    return {
      ...initialState,
      ...gameState,
    } satisfies GameState;
  }),
  on(Action.completeGame, (state) => {
    return {
      ...state,
      readonly: true,
    } satisfies GameState;
  }),
  on(Action.useHint, (state) => {
    if (state.activeHintIndex !== null) {
      if (state.activeHintInAnimation) {
        return state;
      }
      const activeHintSolution = state.solutionStates[state.activeHintIndex];
      return {
        ...state,
        activeHintInAnimation: true,
        tipsUsed: state.tipsUsed + 1,
        gameEvents: [...state.gameEvents, GameEvent.HintUsed],
        letterStates: state.letterStates.map((l) => {
          const index = activeHintSolution.locations.findIndex(loc => loc.row === l.location.row && loc.col === l.location.col);
          return {
            ...l,
            hintTiming: index !== -1 ? index + 1 : l.hintTiming,
          };
        }),
      };
    }
    let selectedSolution = state.solutionStates.find(s => !s.isSuperSolution && !s.found);
    if (!selectedSolution) {
      selectedSolution = state.solutionStates.find(s => s.isSuperSolution && !s.found);
    }
    if (!selectedSolution) {
      return state;
    }
    return {
      ...state,
      tipsUsed: state.tipsUsed + 1,
      gameEvents: [...state.gameEvents, GameEvent.HintUsed],
      letterStates: state.letterStates.map((l) => {
        if (selectedSolution.locations.some(loc => loc.row === l.location.row && loc.col === l.location.col)) {
          return {
            ...l,
            hintTiming: 0,
          };
        }
        return l;
      }),
      activeHintIndex: state.solutionStates.findIndex(s => s === selectedSolution),
      activeHintInAnimation: false,
    } satisfies GameState;
  }),
  on(Action.appendToCurrentTry, (state, { locationToAppend }) => {
    let updatedCurrentTry = state.currentTry;
    const currentTryLetterStates = state.currentTry.map(loc => letterAt(state.letterStates, loc));
    const letterAlreadyInTryAt = currentTryLetterStates.findIndex(l => l.location.row === locationToAppend.row && l.location.col === locationToAppend.col);
    // if letter is last letter in try, return old state
    if (currentTryLetterStates.length > 0 && letterAlreadyInTryAt === currentTryLetterStates.length - 1) {
      return state;
    }
    if (letterAlreadyInTryAt !== -1) {
      // remove all letters after this letter
      updatedCurrentTry = currentTryLetterStates.slice(0, letterAlreadyInTryAt + 1).map(l => l.location);
    }
    else {
      if (state.currentTry.length === 0) {
        updatedCurrentTry = [locationToAppend];
      }
      else {
        // require coordinates of latest try point and locationToAppend to touch on sides or corners
        const lastTryLocation = currentTryLetterStates[currentTryLetterStates.length - 1].location;
        if (Math.abs(lastTryLocation.row - locationToAppend.row) <= 1 && Math.abs(lastTryLocation.col - locationToAppend.col) <= 1) {
          updatedCurrentTry = [...state.currentTry, locationToAppend];
        }
        else {
          updatedCurrentTry = [locationToAppend];
        }
      }
    }
    return {
      ...state,
      ...status(updatedCurrentTry.map(l => letterAt(state.letterStates, l).letter).join('')),
      currentTry: updatedCurrentTry,
      tryConnections: updatedCurrentTry.map((letter, index) => index > 0
        ? {
            isGuessActive: true,
            isSolutionActive: false,
            isSuperSolutionActive: false,
            from: state.currentTry[index - 1],
            to: letter,
          }
        : null).filter(c => c !== null),
      letterStates: state.letterStates.map((l) => {
        return {
          ...l,
          isGuessActive: updatedCurrentTry.some(loc => loc.row === l.location.row && loc.col === l.location.col),
        };
      }),
    } satisfies GameState;
  }),
  on(Action.cancelCurrentTry, (state) => {
    return {
      ...state,
      currentTry: [],
      tryConnections: [],
    } satisfies GameState;
  }),
  on(Action.submitCurrentTry, (state, { acceptableTryWords }) => {
    if (state.currentTry.length < 1) {
      return {
        ...state,
      } satisfies GameState;
    }
    const tryPath = getSolutionCompareString(state.letterStates, state.currentTry);
    const solutionPaths = state.solutionStates.map(s => ({
      solution: s,
      path: getSolutionCompareString(state.letterStates, s.locations),
    }));
    const solutionMatch = solutionPaths.find(s => s.path === tryPath)?.solution;
    if (solutionMatch) {
      if (solutionMatch.found) {
        return {
          ...state,
          ...status('Bereits gefunden'),
          currentTry: [],
          tryConnections: [],
          letterStates: state.letterStates.map((l) => {
            return {
              ...l,
              isGuessActive: false,
            };
          }),
        } satisfies GameState;
      }
      // new solution found
      return {
        ...state,
        solutionStates: state.solutionStates.map((s) => {
          if (s === solutionMatch) {
            return {
              ...s,
              found: true,
            };
          }
          return s;
        }),
        gameEvents: [...state.gameEvents, solutionMatch.isSuperSolution ? GameEvent.SuperSolutionFound : GameEvent.SolutionFound],
        ...state.solutionStates.every(s => s.found || s === solutionMatch)
          ? status('GEWONNEN!', AUTO_TEXT_COLOR_SUPER_SOLUTION)
          : solutionMatch.isSuperSolution
            ? status('DURCHGANGSWORT!', AUTO_TEXT_COLOR_SUPER_SOLUTION)
            : status(state.currentTry.map(loc => letterAt(state.letterStates, loc).letter).join(''), AUTO_TEXT_COLOR_SOLUTION),

        currentTry: [],
        tryConnections: [],
        fixedConnections: [
          ...state.fixedConnections,
          ...state.tryConnections.map(c => ({
            ...c,
            isGuessActive: false,
            isSolutionActive: !solutionMatch.isSuperSolution,
            isSuperSolutionActive: solutionMatch.isSuperSolution,
          })),
        ],
        letterStates: state.letterStates.map((l) => {
          if (solutionMatch.locations.some(loc => loc.row === l.location.row && loc.col === l.location.col)) {
            return {
              ...l,
              isGuessActive: false,
              isSolutionActive: !solutionMatch.isSuperSolution,
              isSuperSolutionActive: solutionMatch.isSuperSolution,
              hintTiming: -1,
            };
          }
          return {
            ...l,
            isGuessActive: false,
          };
        }),
        activeHintIndex: state.solutionStates.findIndex(s => s === solutionMatch) === state.activeHintIndex ? null : state.activeHintIndex,
      };
    }
    const tryWord = state.currentTry.map(loc => letterAt(state.letterStates, loc).letter).join('');
    if (tryWord.length < 1) {
      return {
        ...state,
        currentTry: [],
        tryConnections: [],
      } satisfies GameState;
    }
    if (tryWord.length < 4) {
      return {
        ...state,
        ...status('Zu kurz!'),
        currentTry: [],
        tryConnections: [],
        letterStates: state.letterStates.map((l) => {
          return {
            ...l,
            isGuessActive: false,
          };
        }),
      } satisfies GameState;
    }
    if (state.nonSolutionWordsFound.includes(tryWord)) {
      return {
        ...state,
        ...status('Bereits gefunden'),
        currentTry: [],
        tryConnections: [],
        letterStates: state.letterStates.map((l) => {
          return {
            ...l,
            isGuessActive: false,
          };
        }),
      } satisfies GameState;
    }
    if (!acceptableTryWords.includes(tryWord)) {
      return {
        ...state,
        ...status('Nicht im Wörterbuch'),
        currentTry: [],
        tryConnections: [],
        letterStates: state.letterStates.map((l) => {
          return {
            ...l,
            isGuessActive: false,
          };
        }),
      } satisfies GameState;
    }
    return {
      ...state,
      nonSolutionWordsFound: [...state.nonSolutionWordsFound, tryWord],
      letterStates: state.letterStates.map((l) => {
        const index = state.currentTry.findIndex(loc => loc.row === l.location.row && loc.col === l.location.col);
        if (index !== -1) {
          return {
            ...l,
            hintFoundDelay: (index + 1) * 25,
            isGuessActive: false,
          };
        }
        return {
          ...l,
          hintFoundDelay: 0,
        };
      }),
      currentTry: [],
      tryConnections: [],
    } satisfies GameState;
  }),
  on(Action.updateLetterState, (state, { letterUpdate }) => {
    return {
      ...state,
      letterStates: state.letterStates.map((l) => {
        if (l.location.row === letterUpdate.location.row && l.location.col === letterUpdate.location.col) {
          return {
            ...l,
            ...letterUpdate,
          };
        }
        return l;
      }),
    } satisfies GameState;
  }),
);
