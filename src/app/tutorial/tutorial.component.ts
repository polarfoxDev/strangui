import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetterComponent } from '../strands/letter/letter.component';
import { Connection, Letter } from '../strands/models';
import { Figure, FigureEvent } from './models';

@Component({
  selector: 'app-tutorial',
  imports: [RouterModule, LetterComponent],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.css'
})
export class TutorialComponent implements AfterViewInit {

  figure1: Figure = {
    letters: this.makeLetters([
      ['F', 'U', 'C', 'H'],
      ['T', 'I', 'E', 'S'],
      ['K', 'A', 'R', 'E'],
      ['T', 'Z', 'F', 'A'],
      ['E', 'S', 'C', 'H']
    ]),
    connections: [],
    events: [
      this.drawWord([{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 1, col: 3 }]),
      this.drawWord([{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 3, col: 0 }, { row: 3, col: 1 }, { row: 4, col: 0 }]),
      this.drawWord([{ row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 3, col: 3 }, { row: 3, col: 2 }]),
      this.drawWord([{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 3 }], false, true),
      { move: { row: 2, col: 3 }, delay: 1000, opacity: 0 },
    ].flat(),
    cursor: {
      opacity: 0,
      x: 2,
      y: 3
    }
  }

  figure2: Figure = {
    letters: this.makeLetters([
      ['F', 'U', 'C', 'H'],
      ['T', 'I', 'E', 'S'],
      ['K', 'A', 'R', 'E'],
      ['T', 'Z', 'F', 'A'],
      ['E', 'S', 'C', 'H']
    ]),
    connections: [],
    events: [
      this.drawWord([{ row: 2, col: 2 }, { row: 1, col: 2 }, { row: 1, col: 1 }, { row: 0, col: 0 }], false, false),
      { delay: 0, pos: { row: 2, col: 2 }, update: (letter: Letter) => letter.hintFoundDelay = 0 },
      { delay: 0, pos: { row: 1, col: 2 }, update: (letter: Letter) => letter.hintFoundDelay = 25 },
      { delay: 0, pos: { row: 1, col: 1 }, update: (letter: Letter) => letter.hintFoundDelay = 50 },
      { delay: 0, pos: { row: 0, col: 0 }, update: (letter: Letter) => letter.hintFoundDelay = 75 },
      { move: { row: 5, col: 1 }, delay: 1000, opacity: 0.5 },
      { move: { row: 5, col: 1 }, delay: 1000, opacity: 1 },
      { move: { row: 5, col: 1 }, delay: 200, opacity: 0.5 },
      { move: { row: 5, col: 3 }, delay: 200, opacity: 0.5 },
      { delay: 500, pos: { row: 0, col: 0 }, update: (letter: Letter) => letter.hintTiming = 0 },
      { delay: 0, pos: { row: 0, col: 1 }, update: (letter: Letter) => letter.hintTiming = 0 },
      { delay: 0, pos: { row: 0, col: 2 }, update: (letter: Letter) => letter.hintTiming = 0 },
      { delay: 0, pos: { row: 0, col: 3 }, update: (letter: Letter) => letter.hintTiming = 0 },
      { delay: 0, pos: { row: 1, col: 3 }, update: (letter: Letter) => letter.hintTiming = 0 },
      { move: { row: 5, col: 1 }, delay: 2000, opacity: 0.5 },
      { move: { row: 5, col: 1 }, delay: 1000, opacity: 1 },
      { move: { row: 5, col: 1 }, delay: 200, opacity: 0.5 },
      { move: { row: 5, col: 3 }, delay: 200, opacity: 0.5 },
      { delay: 500, pos: { row: 0, col: 0 }, update: (letter: Letter) => letter.hintTiming = 1 },
      { delay: 0, pos: { row: 0, col: 1 }, update: (letter: Letter) => letter.hintTiming = 2 },
      { delay: 0, pos: { row: 0, col: 2 }, update: (letter: Letter) => letter.hintTiming = 3 },
      { delay: 0, pos: { row: 0, col: 3 }, update: (letter: Letter) => letter.hintTiming = 4 },
      { delay: 0, pos: { row: 1, col: 3 }, update: (letter: Letter) => letter.hintTiming = 5 },
      { move: { row: 5, col: 3 }, delay: 5000, opacity: 0 },
      { delay: 0, pos: { row: 0, col: 0 }, update: (letter: Letter) => letter.hintTiming = -1 },
      { delay: 0, pos: { row: 0, col: 1 }, update: (letter: Letter) => letter.hintTiming = -1 },
      { delay: 0, pos: { row: 0, col: 2 }, update: (letter: Letter) => letter.hintTiming = -1 },
      { delay: 0, pos: { row: 0, col: 3 }, update: (letter: Letter) => letter.hintTiming = -1 },
      { delay: 0, pos: { row: 1, col: 3 }, update: (letter: Letter) => letter.hintTiming = -1 },
    ].flat(),
    cursor: {
      opacity: 0,
      x: 5,
      y: 3
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.runFigure(this.figure1);
      this.runFigure(this.figure2);
    }, 1000);
  }

  runFigure(figure: Figure) {
    // run the events and await the delays in between
    let lastDelay = 0;
    figure.events.forEach(event => {
      setTimeout(() => {
        if ('pos' in event) {
          event.update(figure.letters[event.pos.row * 4 + event.pos.col]);
        } else if ('move' in event) {
          figure.cursor = { opacity: event.opacity, x: event.move.row, y: event.move.col };
        } else {
          const from = figure.letters[event.from.row * 4 + event.from.col];
          const to = figure.letters[event.to.row * 4 + event.to.col];
          let connection = figure.connections.find(c => JSON.stringify([c.from, c.to]) === JSON.stringify([from.location, to.location]));
          if (!connection) {
            connection = {
              from: from.location,
              to: to.location,
              isGuessActive: false,
              isSolutionActive: false,
              isSuperSolutionActive: false,
            };
            figure.connections.push(connection);
          }
          event.update(connection);
        }
      }, lastDelay + event.delay);
      lastDelay += event.delay;
    });
    setTimeout(() => {
      figure.connections = [];
      figure.letters = this.makeLetters([
        ['F', 'U', 'C', 'H'],
        ['T', 'I', 'E', 'S'],
        ['K', 'A', 'R', 'E'],
        ['T', 'Z', 'F', 'A'],
        ['E', 'S', 'C', 'H']
      ]);
    }, lastDelay + 3000);
    setTimeout(() => {
      this.runFigure(figure);
    }, lastDelay + 4000);
  }

  drawWord(positions: { row: number, col: number }[], isSolution = true, isSuperSolution = false): FigureEvent[] {
    const events: FigureEvent[] = [
      {
        delay: 1000, opacity: 0.5, move: positions[0],
      },
      {
        delay: 500, opacity: 1, move: positions[0],
      },
      {
        delay: 200, pos: positions[0],
        update: (letter: Letter) => {
          letter.isGuessActive = true;
        }
      },
    ];
    positions.slice(1).forEach((position, index) => {
      const previous = positions[index];
      events.push(
        {
          delay: 600, opacity: 1, move: position,
        },
        {
          delay: 0, from: previous, to: position,
          update: (connection: Connection) => {
            connection.isGuessActive = true;
          }
        },
        {
          delay: 100, pos: position,
          update: (letter: Letter) => {
            letter.isGuessActive = true;
          }
        });
    });
    events.push(
      {
        delay: 500, opacity: 0.5, move: positions.at(-1)!,
      },
      {
        delay: 100, pos: positions[0],
        update: (letter: Letter) => {
          letter.isGuessActive = false;
          letter.isSolutionActive = isSolution;
          letter.isSuperSolutionActive = isSuperSolution;
        }
      }
    );
    positions.slice(1).forEach((position, index) => {
      const previous = positions[index];
      events.push({
        delay: 0, pos: position,
        update: (letter: Letter) => {
          letter.isGuessActive = false;
          letter.isSolutionActive = isSolution;
          letter.isSuperSolutionActive = isSuperSolution;
        }
      }, {
        delay: 0, from: previous, to: position,
        update: (connection: Connection) => {
          connection.isGuessActive = false;
          connection.isSolutionActive = isSolution;
          connection.isSuperSolutionActive = isSuperSolution;
        }
      });
    });
    return events;
  }

  makeLetters(letterStrings: string[][]): Letter[] {
    const letters: Letter[] = [];
    letterStrings.forEach((rowLetters, row) => {
      letters.push(...rowLetters.map((letter, col) => {
        return {
          letter,
          isGuessActive: false,
          isSolutionActive: false,
          isSuperSolutionActive: false,
          hintTiming: -1,
          hintFoundDelay: 0,
          location: { row: row + 3, col }
        };
      }));
    });
    return letters;
  }
}
