import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StrandsService } from '../core/strands.service';
import { GameEvent } from '../strands/models';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-results',
  imports: [SpinnerComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  hintsUsed = 0;
  timeLeft = '';
  title = '';
  subTitle = '';
  emojiLines: string[] = [];
  loading = true;
  ready = false;
  gameEvents: GameEvent[] = [];
  dateISO = '';

  readonly HINT_ICON = '💡';
  readonly SOLUTION_ICON = '🔵';
  readonly SUPER_SOLUTION_ICON = '🟣';
  readonly LINE_BREAK = '\n';

  constructor(private route: ActivatedRoute, private strandsService: StrandsService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.dateISO = params['date'];
      const gameState = strandsService.getCurrentGameState(this.dateISO);
      if (!gameState) {
        this.loading = false;
        return;
      }
      this.strandsService.loadRiddle(this.dateISO).subscribe(riddle => {
        this.hintsUsed = gameState.tipsUsed;
        if (this.calculateTimeLeft() > 0) {
          this.tickTimer();
        }
        this.gameEvents = gameState.gameEvents;
        this.title = 'Stränge.de #' + riddle.index;
        this.subTitle = "„" + riddle.theme + "“";
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
    const timeUntilNextDay = 24 * 60 * 60 * 1000 - (new Date().getTime() % (24 * 60 * 60 * 1000));
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
    let gameResult = events.map(event => {
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

  share() {
    const clipboardText = this.title + this.LINE_BREAK + this.subTitle + this.LINE_BREAK + this.emojiLines.join(this.LINE_BREAK) + this.LINE_BREAK;
    navigator.clipboard.writeText(clipboardText);
    navigator.share({ title: this.title, text: clipboardText });
  }

  back() {
    this.router.navigate(['/']);
  }

  today() {
    this.router.navigate(['/']);
  }
}
