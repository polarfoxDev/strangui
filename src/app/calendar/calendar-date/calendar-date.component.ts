import { Component, inject, Input } from '@angular/core';
import { CalendarDate } from '../calendar.models';
import { DatePipe } from '@angular/common';
import { GameStatus } from '../../strands/models';
import { Router } from '@angular/router';

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
