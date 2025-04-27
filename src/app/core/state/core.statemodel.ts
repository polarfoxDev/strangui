import { PersistentGameState } from "../../strands/models";

export interface CoreState {
  availableGames: GameMetadataByDateMap;
  activeGame: PersistentGameState | null;
  loading: boolean;
}

export type GameMetadataByDateMap = {
  [date: string]: GameMetadata;
};

export interface GameMetadata {
  id: string;
  finished: boolean;
}
