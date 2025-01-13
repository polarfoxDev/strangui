import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstRiddleDateISO } from '../core/constants';

@Component({
  selector: 'app-date-selector',
  imports: [RouterModule, FormsModule],
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.css'
})
export class DateSelectorComponent {
  readonly minISODate = firstRiddleDateISO;
  readonly minDateString = new Date(firstRiddleDateISO).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });;
  readonly todayISODate = new Date().toISOString().substring(0, 10);
  readonly todayDateString = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  displayedDate: string = 'von heute';
  selectedDate: string = this.todayISODate;

  outOfRangeOrInvalid: boolean = false;

  setDate(date: string): void {
    this.displayedDate = this.getDisplayedDate(date);
  }

  private getDisplayedDate(dateString: string): string {
    const date = new Date(dateString);
    const minDate = new Date(this.minISODate);
    const maxDate = new Date(this.todayISODate);
    date.setHours(0, 0, 0, 0);
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    if (date.valueOf() < minDate.valueOf() || date.valueOf() > maxDate.valueOf()) {
      this.outOfRangeOrInvalid = true;
      return 'ungültiges Datum';
    }
    this.outOfRangeOrInvalid = false;
    if (dateString === this.todayISODate) {
      return 'von heute';
    } else {
      return 'vom ' + date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }

}
