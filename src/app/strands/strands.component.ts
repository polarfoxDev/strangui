import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import { environment } from '@env/environment';
import { loadGameByDate, setVisited } from '@core-state/core.actions';
import * as CoreSelector from '@core-state/core.selectors';
import { defaultLetterGrid } from '@core/constants';
import { StrandsService } from '@core/strands.service';
import { UpdateService } from '@core/update.service';
import { toLocaleISODate } from '@core/utils';
import * as GameAction from '@game-state/strands.actions';
import * as GameSelector from '@game-state/strands.selectors';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LetterComponent } from './letter/letter.component';
import { LetterLocation, MouseAction } from './models';

@Component({
  selector: 'app-strands',
  imports: [LetterComponent, RouterModule, SpinnerComponent, AsyncPipe],
  templateUrl: './strands.component.html',
  styleUrl: './strands.component.css'
})
export class StrandsComponent implements OnDestroy {
  readonly AUTO_TEXT_COLOR = 'light-dark(var(--dark-text), var(--light-text))';
  readonly AUTO_TEXT_COLOR_SOLUTION = 'light-dark(var(--solution), var(--solution-brighter))';
  readonly AUTO_TEXT_COLOR_SUPER_SOLUTION = 'light-dark(var(--super-solution), var(--super-solution-brighter))';
  private strandsService = inject(StrandsService);
  protected updateService = inject(UpdateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  private subscriptions = new Subscription();

  theme$ = this.store.select(GameSelector.themeSelector);
  statusText$ = this.store.select(GameSelector.statusTextSelector);
  statusColor$ = this.store.select(GameSelector.statusColorSelector);
  letterStates$ = this.store.select(GameSelector.letterStatesSelector);
  finished$ = this.store.select(GameSelector.finishedSelector);
  connections$ = this.store.select(GameSelector.allConnectionsSelector);
  unusedHintWordCount$ = this.store.select(GameSelector.unusedHintWordCountSelector);
  solutionCount$ = this.store.select(GameSelector.solutionCountSelector);
  finishedSolutionCount$ = this.store.select(GameSelector.finishedSolutionCountSelector);
  gameState$ = this.store.select(GameSelector.currentGameState);
  readonly = false;

  loading$ = this.store.select(CoreSelector.loadingSelector);
  gameLoadingErrorDetails$ = this.store.select(CoreSelector.gameLoadingErrorDetailsSelector);
  gameLoadingError$ = this.store.select(CoreSelector.gameLoadingErrorSelector);

  touchCoordinateScaleFactor = 1;

  dragTryActive = false;

  date = '';
  dateISO = '';
  isHistoryMode = false;
  updateAvailable = false;

  lastMouseLocation: LetterLocation | undefined;

  acceptableWords: string[] = [];

  checkForUpdate(): void {
    this.updateService.checkForUpdate().subscribe(updateAvailable => {
      this.updateAvailable = updateAvailable;
    });
  }

  constructor() {
    this.subscriptions.add(this.store.select(GameSelector.completedSelector).subscribe(completed => {
      this.readonly = completed;
    }));
    this.setScreenSize();
    this.store.select(CoreSelector.firstVisitSelector).pipe(take(1)).subscribe(firstVisit => {
      if (firstVisit) {
        this.store.dispatch(setVisited());
        setTimeout(() => {
          this.router.navigate(['tutorial']);
        }, 200);
        return;
      }
      this.subscriptions.add(this.strandsService.getAcceptableTryWords().subscribe({
        next: words => {
          this.acceptableWords = words;
        },
        error: () => {
          console.error('Error loading word list');
        }
      }));
      let date = new Date();
      let dateISOString = toLocaleISODate(date);
      this.subscriptions.add(this.route.params.subscribe(params => {
        const dateParam = params['date'];
        if (dateParam) {
          try {
            const newDate = new Date(dateParam);
            if (newDate.toString() === 'Invalid Date') {
              throw new Error();
            }
            if (dateISOString === newDate.toISOString().substring(0, 10)) {
              this.router.navigate(['']);
              return;
            }
            // disable future dates
            if (toLocaleISODate(newDate) > dateISOString) {
              console.error('Future date requested');
              if (environment.production) {
                this.router.navigate(['']);
                return;
              }
            }
            date = newDate;
            dateISOString = newDate.toISOString().substring(0, 10);
          } catch {
            console.error('Invalid date parameter');
            this.router.navigate(['']);
            return;
          }
        }
        this.checkForUpdate();
        this.date = date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        this.dateISO = date.toISOString().substring(0, 10);
        this.isHistoryMode = !!dateParam;
        this.store.dispatch(loadGameByDate(this.dateISO));
      }));
    });
  }

  @HostListener('mouseup')
  onMouseup() {
    if (this.readonly) {
      this.dragTryActive = false;
      return;
    }
    this.dragTryActive = false;
    this.store.dispatch(GameAction.submitCurrentTry(this.acceptableWords));
  }

  onLetterMouseEvent(mouseAction: MouseAction, location: LetterLocation): void {
    if (this.readonly) {
      this.dragTryActive = false;
      return;
    }
    if (mouseAction === MouseAction.Click) {
      this.dragTryActive = false;
      this.store.dispatch(GameAction.appendToCurrentTry(location));
      this.store.dispatch(GameAction.submitCurrentTry(this.acceptableWords));
    } else if (mouseAction === MouseAction.Down) {
      this.store.dispatch(GameAction.appendToCurrentTry(location));
      this.dragTryActive = true;
    } else if (mouseAction === MouseAction.Up && !this.dragTryActive) {
      this.dragTryActive = false;
      this.store.dispatch(GameAction.submitCurrentTry(this.acceptableWords));
    } else if (mouseAction === MouseAction.Move) {
      if (this.lastMouseLocation && this.lastMouseLocation.row === location.row && this.lastMouseLocation.col === location.col) {
        return;
      }
      this.lastMouseLocation = location;
      if (this.dragTryActive) {
        this.store.dispatch(GameAction.appendToCurrentTry(location));
      }
    }
  }

  useHint(): void {
    this.store.dispatch(GameAction.useHint());
  }

  @HostListener('window:resize')
  setScreenSize() {
    if (window.innerWidth < 365) {
      this.touchCoordinateScaleFactor = 0.8;
      return;
    }
    this.touchCoordinateScaleFactor = 1;
  }

  private findLetterLocationByPixelLocation(x: number, y: number): LetterLocation | undefined {
    // basic idea: { x: Math.floor(x / 60), y: Math.floor(y / 60) };
    // but only if x and y are within the bounds of the letter circle (letter coordinates are the center of the circle, radius is 42px)
    // so the distance from the center of the circle to the point (x, y) must be less than 42px
    const letterX = Math.floor(x / 60 / this.touchCoordinateScaleFactor);
    const letterY = Math.floor(y / 60 / this.touchCoordinateScaleFactor);
    const letterCenterX = (letterX * 60 + 30) * this.touchCoordinateScaleFactor;
    const letterCenterY = (letterY * 60 + 30) * this.touchCoordinateScaleFactor;
    const distance = Math.sqrt(Math.pow(x - letterCenterX, 2) + Math.pow(y - letterCenterY, 2));
    if (distance < 30) {
      return defaultLetterGrid.find(l => l.location.row === letterX && l.location.col === letterY)?.location;
    }
    return undefined;
  }

  onTouchMove(event: TouchEvent, boundingBox: DOMRect): void {
    event.preventDefault();
    const touch = event.touches[0];
    const y = touch.clientX - boundingBox.left;
    const x = touch.clientY - boundingBox.top;
    const location = this.findLetterLocationByPixelLocation(x, y);
    if (location) {
      this.onLetterMouseEvent(MouseAction.Move, location);
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
    const location = this.findLetterLocationByPixelLocation(x, y);
    if (location) {
      this.onLetterMouseEvent(MouseAction.Down, location);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
