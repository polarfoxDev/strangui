import { Component, HostListener } from '@angular/core';
import { LetterComponent } from './letter/letter.component';
import { Connection, Letter, MouseAction, Solution } from './strands';

@Component({
  selector: 'app-strands',
  imports: [LetterComponent],
  templateUrl: './strands.component.html',
  styleUrl: './strands.component.css'
})
export class StrandsComponent {
  letters: Letter[] = [
    { letter: 'D', location: { x: 0, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'U', location: { x: 0, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'U', location: { x: 0, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'A', location: { x: 0, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'L', location: { x: 0, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'B', location: { x: 0, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'F', location: { x: 1, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'A', location: { x: 1, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'N', location: { x: 1, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'K', location: { x: 1, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'E', location: { x: 1, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'L', location: { x: 1, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'R', location: { x: 2, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'A', location: { x: 2, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'R', location: { x: 2, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'B', location: { x: 2, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'N', location: { x: 2, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'A', location: { x: 2, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'O', location: { x: 3, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'N', location: { x: 3, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'N', location: { x: 3, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'E', location: { x: 3, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'M', location: { x: 3, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'W', location: { x: 3, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'E', location: { x: 4, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'G', location: { x: 4, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'R', location: { x: 4, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'N', location: { x: 4, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'I', location: { x: 4, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'E', location: { x: 4, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'B', location: { x: 5, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'L', location: { x: 5, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'O', location: { x: 5, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'I', location: { x: 5, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'D', location: { x: 5, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'I', location: { x: 5, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'L', location: { x: 6, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'E', location: { x: 6, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'T', location: { x: 6, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'N', location: { x: 6, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'G', location: { x: 6, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'O', location: { x: 6, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'U', location: { x: 7, y: 0 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'A', location: { x: 7, y: 1 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'M', location: { x: 7, y: 2 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'M', location: { x: 7, y: 3 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'I', location: { x: 7, y: 4 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false },
    { letter: 'H', location: { x: 7, y: 5 }, isGuessActive: false, isSolutionActive: false, isSuperSolutionActive: false }
  ];

  fixedConnections: Connection[] = [];
  tryConnections: Connection[] = [];
  connections: Connection[] = [];

  dragTryActive = false;

  currentTry: Letter[] = [];

  solutions: Solution[] = [
    { locations: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 3, y: 4 }, { x: 3, y: 3 }, { x: 3, y: 2 }], isSuperSolution: true },
    { locations: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 0, y: 5 }, { x: 0, y: 4 }, { x: 0, y: 3 }, { x: 0, y: 2 }], isSuperSolution: false },
    { locations: [{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 0 }], isSuperSolution: false },
    { locations: [{ x: 3, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }], isSuperSolution: false },
    { locations: [{ x: 7, y: 5 }, { x: 7, y: 4 }, { x: 7, y: 3 }, { x: 7, y: 2 }, { x: 6, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 1 }, { x: 7, y: 0 }], isSuperSolution: false },
    { locations: [{ x: 5, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 5 },], isSuperSolution: false },
  ];

  constructor() {
    this.calculateConnections();
  }

  @HostListener('mouseup')
  onMouseup() {
    this.dragTryActive = false;
    this.checkWin();
    this.untry();
  }


  untry(recalculate = true): void {
    this.dragTryActive = false;
    this.currentTry.forEach(letter => {
      letter.isGuessActive = false;
    });
    this.currentTry = [];
    if (recalculate) this.calculateConnections();
  }

  calculateConnections(): void {
    this.tryConnections = [];
    this.currentTry.forEach((letter, index) => {
      letter.isGuessActive = true;
      if (index > 0) {
        this.tryConnections.push({ isGuessActive: true, isSolutionActive: false, isSuperSolutionActive: false, from: this.currentTry[index - 1].location, to: letter.location });
      }
    });
    this.connections = this.fixedConnections.concat(this.tryConnections);
  }

  checkWin(): void {
    const tryPath = JSON.stringify(this.currentTry.map(l => l.location));
    if (this.solutions.map(s => JSON.stringify(s.locations)).some(solutionPath => solutionPath === tryPath)) {
      const solution = this.solutions.find(s => JSON.stringify(s.locations) === tryPath);
      this.currentTry.forEach(letter => { letter.isSolutionActive = !solution!.isSuperSolution; letter.isSuperSolutionActive = solution!.isSuperSolution; });
      this.tryConnections.forEach(connection => { connection.isSolutionActive = !solution!.isSuperSolution; connection.isSuperSolutionActive = solution!.isSuperSolution; connection.isGuessActive = false; });
      this.fixedConnections = this.fixedConnections.concat(this.tryConnections);
      this.untry();
    }
  }

  addTryPoint(letter: Letter): void {
    if (this.currentTry.some(l => l === letter)) return;
    // require coordinates of latest try point and current letter to touch on sides or corners
    if (this.currentTry.length > 0) {
      const lastLetter = this.currentTry[this.currentTry.length - 1];
      if (Math.abs(lastLetter.location.x - letter.location.x) <= 1 && Math.abs(lastLetter.location.y - letter.location.y) <= 1) {
        this.currentTry.push(letter);
        this.calculateConnections();
      } else {
        this.untry(false);
        this.currentTry.push(letter);
        this.calculateConnections();
      }
    } else {
      this.currentTry.push(letter);
      this.calculateConnections();
    }
  }

  onLetterMouseEvent(mouseAction: MouseAction, letter: Letter): void {
    if (mouseAction === MouseAction.Click) {
      this.dragTryActive = false;
      this.addTryPoint(letter);
      this.calculateConnections();
      this.checkWin();
    } else if (mouseAction === MouseAction.Down) {
      this.addTryPoint(letter);
      this.dragTryActive = true;
    } else if (mouseAction === MouseAction.Up) {
      this.dragTryActive = false;
      this.checkWin();
      this.untry();
    } else if (mouseAction === MouseAction.Move) {
      if (this.dragTryActive) {
        this.addTryPoint(letter);
      }
    }
  }
}
