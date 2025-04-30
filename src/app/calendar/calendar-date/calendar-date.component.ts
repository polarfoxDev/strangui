import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GameStatus } from '@game/models';
import { CalendarDate } from '../calendar.models';

@Component({
  selector: 'app-calendar-date',
  imports: [DatePipe],
  templateUrl: './calendar-date.component.html',
  styleUrl: './calendar-date.component.css'
})
export class CalendarDateComponent {
  GameStatus = GameStatus;
  private router = inject(Router);

  @Input() date!: CalendarDate;

  selectDate(): void {
    if (this.date.gameStatus !== GameStatus.NotAvailable) {
      this.router.navigate(['/', this.date.date.toISOString().slice(0, 10)]);
    }
  }
}
