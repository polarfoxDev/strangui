import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameEvent } from '../strands/models';
import { SpinnerComponent } from '../spinner/spinner.component';
import { getRiddleIndex } from '../core/utils';
import { DatePipe } from '@angular/common';
import { firstRiddleDateISO } from '../core/constants';
import { Store } from '@ngrx/store';
import { currentGameState } from '../strands/state/strands.selectors';
import { take } from 'rxjs';

@Component({
  selector: 'app-results',
  imports: [RouterModule, SpinnerComponent, DatePipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  hintsUsed = 0;
  timeLeft = '';
  title = '';
  subTitle = '';
  emojiLines: string[] = [];
  loading = true;
  ready = false;
  gameEvents: GameEvent[] = [];
  dateISO = '';
  isHistoric = false;
  canShare = navigator.share !== undefined;
  copyButtonConfirmation = false;
  dateBefore?: Date;
  dateAfter?: Date;

  readonly HINT_ICON = '💡';
  readonly SOLUTION_ICON = '🔵';
  readonly SUPER_SOLUTION_ICON = '🟣';
  readonly LINE_BREAK = '\n';

  constructor() {
    this.route.params.subscribe(params => {
      this.dateISO = params['date'];
      try {
        const a = new Date(this.dateISO);
        if (a.toString() === 'Invalid Date') {
          throw new Error();
        }
      } catch {
        console.error('Invalid date parameter');
        this.router.navigate(['/']);
        return;
      }
      if (this.dateISO !== new Date().toISOString().substring(0, 10)) {
        this.isHistoric = true;
        if (this.dateISO !== firstRiddleDateISO) {
          this.dateBefore = new Date(this.dateISO);
          this.dateBefore.setDate(this.dateBefore.getDate() - 1);
        }
        this.dateAfter = new Date(this.dateISO);
        this.dateAfter.setDate(this.dateAfter.getDate() + 1);
        if (this.dateAfter.toISOString().substring(0, 10) === new Date().toISOString().substring(0, 10)) {
          this.dateAfter = undefined;
        }
      }
      this.tryShare();
      this.store.select(currentGameState).pipe(take(1)).subscribe(gameState => {
        if (!gameState || gameState.solutionStates.length === 0 || gameState.solutionStates.some(s => !s.found)) {
          this.loading = false;
          console.error('Game state not found or not finished');
          this.router.navigate(['..'], { relativeTo: this.route });
          return;
        }
        this.hintsUsed = gameState.tipsUsed;
        if (this.calculateTimeLeft() > 0) {
          this.tickTimer();
        }
        this.gameEvents = gameState.gameEvents;
        this.title = 'Stränge.de #' + getRiddleIndex(this.dateISO);
        this.subTitle = "„" + gameState.theme + "“";
        this.calculateEmojis();
        this.loading = false;
        this.ready = true;
      });
    });
  }

  tickTimer(): void {
    // tick timer every second
    const timer = setInterval(() => {
      if (this.loading) {
        clearInterval(timer);
        return;
      }
      this.calculateTimeLeft();
    }, 1000);
  }

  private calculateTimeLeft(): number {
    const now = new Date();
    const timeUntilNextDay = (24 * 60 * 60 * 1000) - (now.getHours() * 60 * 60 * 1000 + now.getMinutes() * 60 * 1000 + now.getSeconds() * 1000 + now.getMilliseconds());
    // format timeLeft as HH:MM:SS
    const date = new Date(timeUntilNextDay);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    this.timeLeft = `${hours}:${minutes}:${seconds}`;
    // return time left in milliseconds
    return timeUntilNextDay;
  }

  calculateEmojis(): void {
    // inject null event every 5th event to create line break
    const events = this.gameEvents.reduce((acc, event, index) => {
      acc.push(event);
      if ((index + 1) % 4 === 0) {
        acc.push(null);
      }
      return acc;
    }, [] as (GameEvent | null)[]);
    // remove trailing null event
    if (events[events.length - 1] === null) {
      events.pop();
    }
    const gameResult = events.map(event => {
      switch (event) {
        case GameEvent.SolutionFound:
          return this.SOLUTION_ICON;
        case GameEvent.SuperSolutionFound:
          return this.SUPER_SOLUTION_ICON;
        case GameEvent.HintUsed:
          return this.HINT_ICON;
        default:
          return this.LINE_BREAK;
      }
    }).join('');
    this.emojiLines = gameResult.split(this.LINE_BREAK);
  }

  tryShare() {
    this.canShare = navigator.canShare({ title: this.title, text: this.getShareText() });
  }

  private getShareText(): string {
    return this.title + this.LINE_BREAK + this.subTitle + this.LINE_BREAK + this.emojiLines.join(this.LINE_BREAK) + this.LINE_BREAK;
  }

  share() {
    navigator.share({ title: this.title, text: this.getShareText() });
  }

  copy() {
    navigator.clipboard.writeText(this.getShareText());
    this.copyButtonConfirmation = true;
    setTimeout(() => {
      this.copyButtonConfirmation = false;
    }, 3000);
  }
}
