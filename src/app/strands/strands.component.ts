import { Component, HostListener } from '@angular/core';
import { LetterComponent } from './letter/letter.component';
import { Connection, GameEvent, GameState, Letter, LetterLocation, MouseAction, Solution } from './models';
import { StrandsService } from '../core/strands.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { defaultLetterGrid } from '../core/constants';
import { AppStorage, SafeStorageAccessor } from '../core/storage';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-strands',
  imports: [LetterComponent, RouterModule, SpinnerComponent],
  templateUrl: './strands.component.html',
  styleUrl: './strands.component.css'
})
export class StrandsComponent {
  readonly AUTO_TEXT_COLOR = 'light-dark(var(--dark-text), var(--light-text))';
  readonly AUTO_TEXT_COLOR_SOLUTION = 'light-dark(var(--solution), var(--solution-brighter))';
  readonly AUTO_TEXT_COLOR_SUPER_SOLUTION = 'light-dark(var(--super-solution), var(--super-solution-brighter))';

  letters: Letter[] = [];

  fixedConnections: Connection[] = [];
  tryConnections: Connection[] = [];
  connections: Connection[] = [];

  nonSolutionWordsFound: string[] = [];
  tipsUsed = 0;

  activeHint: Solution | null = null;
  activeHintInAnimation = false;

  dragTryActive = false;

  currentTry: Letter[] = [];

  solutions: Solution[] = [];

  statusText = '';
  statusColor = this.AUTO_TEXT_COLOR;

  gameEvents: GameEvent[] = [];

  date = '';
  dateISO = '';
  isHistoryMode = false;
  theme = '';
  finished = false;
  ready = false;
  loading = true;
  finishedCount = 0;

  gameState: SafeStorageAccessor<GameState> = AppStorage.inMemorySafeAccessor({} as GameState);

  constructor(private strandsService: StrandsService, private route: ActivatedRoute, private router: Router) {
    if (AppStorage.getSafe('firstVisit', true)) {
      AppStorage.set('firstVisit', false);
      this.router.navigate(['tutorial']);
      return;
    }
    let date = new Date();
    this.route.params.subscribe(params => {
      const dateParam = params['date'];
      if (dateParam) {
        const newDate = new Date(dateParam);
        if (date.toISOString().substring(0, 10) === newDate.toISOString().substring(0, 10)) {
          this.router.navigate(['']);
          return;
        }
        date = newDate;
      }
      this.date = date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
      this.dateISO = date.toISOString().substring(0, 10);
      this.isHistoryMode = !!dateParam;
      this.strandsService.loadRiddle(this.dateISO).subscribe({
        next: riddle => {
          const defaultGridCopy: Letter[] = JSON.parse(JSON.stringify(defaultLetterGrid));
          this.gameState = this.strandsService.getGameStateAccessor(this.dateISO, [], defaultGridCopy);
          this.gameState.init();
          const currentState = this.gameState.get();
          console.log(currentState.letterStates);
          this.theme = riddle.theme;
          const riddleLetters: string[] = riddle.letters.flat();
          this.letters = defaultGridCopy;
          this.letters.forEach(letter => {
            letter.isGuessActive = false;
            letter.isSolutionActive = false;
            letter.isSuperSolutionActive = false;
            letter.hintTiming = -1;
            letter.letter = riddleLetters.shift()!;
          });
          this.solutions = riddle.solutions.map(s => ({ ...s, found: false }));
          this.nonSolutionWordsFound = currentState.nonSolutionWordsFound;
          this.tipsUsed = currentState.tipsUsed;
          this.finishedCount = currentState.solutionStates.filter(s => s.found).length;
          this.gameEvents = currentState.gameEvents;
          this.activeHint = this.solutions.find(s => JSON.stringify(s.locations) === JSON.stringify(currentState.activeHint?.locations)) || null;
          this.activeHintInAnimation = currentState.activeHintInAnimation;
          this.fixedConnections = currentState.fixedConnections;
          this.tryConnections = [];
          this.connections = [];
          this.statusText = '';
          this.statusColor = this.AUTO_TEXT_COLOR;
          currentState.fixedConnections.forEach(connection => {
            this.fixedConnections.push({ ...connection });
          });
          currentState.letterStates.forEach(letter => {
            const currentLetter = this.letters.find(l => l.location.x === letter.location.x && l.location.y === letter.location.y);
            if (currentLetter) {
              currentLetter.isGuessActive = letter.isGuessActive;
              currentLetter.isSolutionActive = letter.isSolutionActive;
              currentLetter.isSuperSolutionActive = letter.isSuperSolutionActive;
              currentLetter.hintTiming = letter.hintTiming;
            }
          });
          currentState.solutionStates.forEach(solution => {
            const currentSolution = this.solutions.find(s => JSON.stringify(s.locations) === JSON.stringify(solution.locations));
            if (currentSolution) {
              currentSolution.found = solution.found;
            }
          });
          this.calculateConnections();
          this.checkWin();
          this.ready = true;
          this.loading = false;
        },
        error: () => {
          this.ready = false;
          this.loading = false;
        }
      });
    });
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

  win(): void {
    this.setStatus('GEWONNEN!', this.AUTO_TEXT_COLOR_SUPER_SOLUTION);
    this.finished = true;
  }

  private getSolutionCompareString(letters: Letter[]): string {
    const printedWord = letters.map(l => l.letter).join('');
    const sortedLetterLocations = letters.map(l => l.location).sort((a, b) => a.x - b.x || a.y - b.y);
    const compareString = JSON.stringify([printedWord, sortedLetterLocations]);
    return compareString;
  }

  private getSolutionCompareStringByLocations(locations: LetterLocation[]): string {
    const letters = locations.map(location => this.letters.find(l => l.location.x === location.x && l.location.y === location.y)!);
    return this.getSolutionCompareString(letters);
  }

  checkWin(): void {
    if (this.solutions.every(s => s.found)) {
      this.win();
    }
    const tryPath = this.getSolutionCompareString(this.currentTry);
    if (this.solutions.map(s => this.getSolutionCompareStringByLocations(s.locations)).some(solutionPath => solutionPath === tryPath)) {
      const solution = this.solutions.find(s => this.getSolutionCompareStringByLocations(s.locations) === tryPath);
      if (solution!.found) {
        this.setStatus('Bereits gefunden');
        return;
      }
      solution!.found = true;
      this.gameEvents.push(solution!.isSuperSolution ? GameEvent.SuperSolutionFound : GameEvent.SolutionFound);
      this.finishedCount++;
      if (solution!.isSuperSolution) {
        this.setStatus('DURCHGANGSWORT!', this.AUTO_TEXT_COLOR_SUPER_SOLUTION);
      } else {
        this.setStatus(this.currentTry.map(l => l.letter).join(''), this.AUTO_TEXT_COLOR_SOLUTION);
      }
      this.currentTry.forEach(letter => { letter.isSolutionActive = !solution!.isSuperSolution; letter.isSuperSolutionActive = solution!.isSuperSolution; });
      this.tryConnections.forEach(connection => { connection.isSolutionActive = !solution!.isSuperSolution; connection.isSuperSolutionActive = solution!.isSuperSolution; connection.isGuessActive = false; });
      this.fixedConnections = this.fixedConnections.concat(this.tryConnections);
      this.untry();
      if (this.getSolutionCompareStringByLocations(this.activeHint?.locations ?? []) === tryPath) {
        this.activeHint?.locations.forEach(location => {
          const letter = this.letters.find(l => l.location.x === location.x && l.location.y === location.y);
          letter!.hintTiming = -1;
        });
        this.activeHint = null;
        this.activeHintInAnimation = false;
      }
      if (this.solutions.every(s => s.found)) {
        this.win();
        setTimeout(() => {
          this.router.navigate([this.dateISO, 'results']);
        }, 1000);
      }
      this.gameState.partialUpdate(() => ({ solutionStates: this.solutions, fixedConnections: this.fixedConnections, letterStates: this.letters, gameEvents: this.gameEvents, activeHint: this.activeHint, activeHintInAnimation: this.activeHintInAnimation }));
      return;
    }
    const tryWord = this.currentTry.map(l => l.letter).join('');
    if (tryWord.length < 1) return;
    if (tryWord.length < 4) {
      this.setStatus('Zu kurz');
      return;
    }
    if (this.nonSolutionWordsFound.includes(tryWord)) {
      this.setStatus('Bereits gefunden');
      return;
    }
    if (!this.strandsService.wordExists(tryWord)) {
      this.setStatus('Nicht in der Liste');
      return;
    }
    this.nonSolutionWordsFound.push(tryWord);
    this.currentTry.forEach((letter, index) => {
      letter.hintFoundDelay = (index + 1) * 25;
      setTimeout(() => {
        letter.hintFoundDelay = 0;
      }, 1000 + (index + 1) * 25);
    });
    this.gameState.partialUpdate(() => ({ nonSolutionWordsFound: this.nonSolutionWordsFound }));
  }

  setStatus(text: string, color: string = this.AUTO_TEXT_COLOR): void {
    setTimeout(() => {
      this.statusText = text;
      this.statusColor = color;
    });
  }

  addTryPoint(letter: Letter): void {
    if (this.currentTry.some(l => l === letter)) {
      // remove all letters after this letter
      // also, set back state of all letters after this letter
      const lettersToRemove = this.currentTry.slice(this.currentTry.indexOf(letter) + 1);
      lettersToRemove.forEach(l => l.isGuessActive = false);
      this.currentTry = this.currentTry.slice(0, this.currentTry.indexOf(letter) + 1);
      this.setStatus(this.currentTry.map(l => l.letter).join(''));
      this.calculateConnections();
      return;
    };
    // require coordinates of latest try point and current letter to touch on sides or corners
    if (this.currentTry.length > 0) {
      const lastLetter = this.currentTry[this.currentTry.length - 1];
      if (Math.abs(lastLetter.location.x - letter.location.x) <= 1 && Math.abs(lastLetter.location.y - letter.location.y) <= 1) {
        this.currentTry.push(letter);
        this.setStatus(this.currentTry.map(l => l.letter).join(''));
        this.calculateConnections();
      } else {
        this.untry(false);
        this.currentTry.push(letter);
        this.setStatus(this.currentTry.map(l => l.letter).join(''));
        this.calculateConnections();
      }
    } else {
      this.currentTry.push(letter);
      this.setStatus(this.currentTry.map(l => l.letter).join(''));
      this.calculateConnections();
    }
  }

  onLetterMouseEvent(mouseAction: MouseAction, letter: Letter): void {
    if (this.finished) {
      this.dragTryActive = false;
      return;
    }
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

  useHint(): void {
    if (this.activeHint) {
      if (this.activeHintInAnimation) {
        return;
      }
      this.activeHintInAnimation = true;
      this.tipsUsed++;
      this.gameEvents.push(GameEvent.HintUsed);
      this.activeHint.locations.forEach((location, index) => {
        const letter = this.letters.find(l => l.location.x === location.x && l.location.y === location.y);
        letter!.hintTiming = index + 1;
      });
      this.gameState.partialUpdate(() => ({ tipsUsed: this.tipsUsed, activeHintInAnimation: true, letterStates: this.letters, gameEvents: this.gameEvents }));
      return;
    }
    let selectedSolution = this.solutions.find(s => !s.isSuperSolution && !s.found);
    if (!selectedSolution) {
      selectedSolution = this.solutions.find(s => s.isSuperSolution && !s.found);
    }
    if (selectedSolution) {
      selectedSolution.locations.forEach(location => {
        const letter = this.letters.find(l => l.location.x === location.x && l.location.y === location.y);
        letter!.hintTiming = 0;
      });
      this.activeHint = selectedSolution;
      this.tipsUsed++;
      this.gameEvents.push(GameEvent.HintUsed);
      this.activeHintInAnimation = false;
      this.gameState.partialUpdate(() => ({ tipsUsed: this.tipsUsed, activeHint: selectedSolution, activeHintInAnimation: false, letterStates: this.letters, gameEvents: this.gameEvents }));
    }
  }

  private findLetterByPixelLocation(x: number, y: number): Letter | undefined {
    // basic idea: { x: Math.floor(x / 60), y: Math.floor(y / 60) };
    // but only if x and y are within the bounds of the letter circle (letter coordinates are the center of the circle, radius is 42px)
    // so the distance from the center of the circle to the point (x, y) must be less than 42px
    const letterX = Math.floor(x / 60);
    const letterY = Math.floor(y / 60);
    const letterCenterX = letterX * 60 + 30;
    const letterCenterY = letterY * 60 + 30;
    const distance = Math.sqrt(Math.pow(x - letterCenterX, 2) + Math.pow(y - letterCenterY, 2));
    if (distance < 30) {
      return this.letters.find(l => l.location.x === letterX && l.location.y === letterY);
    }
    return undefined;
  }

  onTouchMove(event: TouchEvent, boundingBox: DOMRect): void {
    event.preventDefault();
    const touch = event.touches[0];
    const y = touch.clientX - boundingBox.left;
    const x = touch.clientY - boundingBox.top;
    const letter = this.findLetterByPixelLocation(x, y);
    if (letter) {
      this.onLetterMouseEvent(MouseAction.Move, letter);
    }
  }

  onTouchEnd(event: TouchEvent): void {
    event.preventDefault();
    this.onMouseup();
  }

  onTouchStart(event: TouchEvent, boundingBox: DOMRect): void {
    event.preventDefault();
    const touch = event.touches[0];
    const y = touch.clientX - boundingBox.left;
    const x = touch.clientY - boundingBox.top;
    const letter = this.findLetterByPixelLocation(x, y);
    if (letter) {
      this.onLetterMouseEvent(MouseAction.Down, letter);
    }
  }
}
