import { PersistentGameState } from "../../strands/models";

export const initialState: CoreState = {
  loading: false,
  activeGame: null,
  availableGames: {},
  lastUpdateCheck: '1970-01-01T00:00:00.000Z',
  lastUpdateCheckResult: false,
  storageVersion: '1.0.0',
  changelogSeenForVersion: '0.0.0',
  firstVisit: true,
};

export interface CoreState extends PersistentCoreState {
  availableGames: GameMetadataByDateMap;
  activeGame: PersistentGameState | null;
  loading: boolean;
}

export interface PersistentCoreState {
  lastUpdateCheck: string;
  lastUpdateCheckResult: boolean;
  storageVersion: string;
  changelogSeenForVersion: string;
  firstVisit: boolean;
}

export const corePropsToPersist = (state: CoreState): PersistentCoreState => {
  return {
    lastUpdateCheck: state.lastUpdateCheck,
    lastUpdateCheckResult: state.lastUpdateCheckResult,
    storageVersion: state.storageVersion,
    changelogSeenForVersion: state.changelogSeenForVersion,
    firstVisit: state.firstVisit,
  };
}

export type GameMetadataByDateMap = Record<string, GameMetadata>;

export interface GameMetadata {
  id: string;
  finished: boolean;
}
