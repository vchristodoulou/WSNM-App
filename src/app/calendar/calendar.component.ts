import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { CalendarEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  minDate = new Date();

  constructor(private router: Router) {}

  ngOnInit() {
    this.minDate.setDate(this.minDate.getDate() - 1);
  }

  dayClicked(date: Date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
    this.router.navigate(['/calendar', JSON.stringify(utcDate)]);
  }

  dateIsValid(date: Date): boolean {
    return (date >= this.minDate);
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (!this.dateIsValid(day.date)) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

}
