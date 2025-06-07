import { defaultLetterGrid } from '@core/constants';
import { GameState } from '@game/models';

export const initialState: GameState = {
  solutionStates: [],
  nonSolutionWordsFound: [],
  tipsUsed: 0,
  gameEvents: [],
  activeHintIndex: null,
  activeHintInAnimation: false,
  fixedConnections: [],
  letterStates: JSON.parse(JSON.stringify(defaultLetterGrid)),
  theme: '',
  statusText: '',
  statusColor: '',
  tryConnections: [],
  currentTry: [],
  date: '',
  readonly: false,
};
