import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstRiddleDateISO } from '@core/constants';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-date-selector',
  imports: [RouterModule, FormsModule, CalendarComponent],
  templateUrl: './date-selector.component.html',
  styleUrl: './date-selector.component.css',
})
export class DateSelectorComponent {
  readonly minISODate = firstRiddleDateISO;

  readonly minDateString = new Date(firstRiddleDateISO).toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });

  readonly todayISODate = new Date().toISOString().substring(0, 10);

  readonly todayDateString = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
