import { Letter, Connection } from "../strands/models";

export interface Figure {
  letters: Letter[];
  connections: Connection[];
  events: FigureEvent[];
  cursor: {
    opacity: number;
    x: number;
    y: number;
  }
}

export type FigureEvent = UpdateLetterEvent | UpdateConnectionEvent | CursorEvent;

export interface UpdateLetterEvent {
  delay: number;
  pos: { col: number, row: number };
  update: (letter: Letter) => void;
}

export interface UpdateConnectionEvent {
  delay: number;
  from: { col: number, row: number },
  to: { col: number, row: number },
  update: (connection: Connection) => void;
}

export interface CursorEvent {
  delay: number;
  opacity: number;
  move: { col: number, row: number };
}
