import { Component, inject } from '@angular/core';
import { CalendarDateComponent } from './calendar-date/calendar-date.component';
import { CalendarDate, CalendarMonth } from './calendar.models';
import { DatePipe } from '@angular/common';
import { firstRiddleDateISO } from '../core/constants';
import { StrandsService } from '../core/strands.service';
import { GameStatus } from '../strands/models';

@Component({
  selector: 'app-calendar',
  imports: [CalendarDateComponent, DatePipe],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  readonly weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private strandsService = inject(StrandsService);

  activeMonth: CalendarMonth = this.createMonth(new Date());

  private createMonth(date: Date): CalendarMonth {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const gridOffset = start.getDay() - 1;
    const dates = this.createDates(start);
    const previousAvailable = this.isSelectable(new Date(start.getFullYear(), start.getMonth(), 0));
    const nextAvailable = this.isSelectable(new Date(start.getFullYear(), start.getMonth() + 1, 1));
    return { gridOffset, dates, previousAvailable, nextAvailable };
  }

  private createDates(start: Date): CalendarDate[] {
    const dates: CalendarDate[] = [];
    const today = new Date().toDateString();
    const year = start.getFullYear();
    const month = start.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < daysInMonth; i++) {
      const day = i + 1;
      const date = new Date(Date.UTC(year, month, day));
      const isToday = date.toDateString() === today;
      const gameStatus = this.isSelectable(date) ? this.strandsService.getRiddleStatus(date.toISOString().slice(0, 10)) : GameStatus.NotAvailable;
      dates.push({ date, isToday, gameStatus });
    }
    return dates;
  }

  private isSelectable(date: Date): boolean {
    const firstAvailableDate = new Date(firstRiddleDateISO);
    const today = new Date();
    return date >= firstAvailableDate && date <= today;
  }

  previousMonth(): void {
    this.activeMonth = this.createMonth(new Date(this.activeMonth.dates[0].date.getFullYear(), this.activeMonth.dates[0].date.getMonth() - 1, 1));
  }

  nextMonth(): void {
    this.activeMonth = this.createMonth(new Date(this.activeMonth.dates[0].date.getFullYear(), this.activeMonth.dates[0].date.getMonth() + 1, 1));
  }
}
