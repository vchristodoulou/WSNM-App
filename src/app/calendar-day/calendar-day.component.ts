import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { CalendarEvent, CalendarDayViewBeforeRenderEvent } from 'angular-calendar';

import { UsersApiService } from '../_services/users-api.service';
import { TimeslotsApiService } from '../_services/timeslots-api.service';
import { Slot } from '../_models/slot';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e56ff',
    secondary: '#D1E8FF'
  },
  green: {
    primary: '#08e30c',
    secondary: '#d9fdba'
  }
};


@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./calendar-day.component.css'],
})
export class CalendarDayComponent implements OnInit {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  timeslotsSub: Subscription;
  nofReserved = 0;
  actions = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
      }
    }
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersApi: UsersApiService,
              private timeslotsService: TimeslotsApiService) {}

  ngOnInit() {
    const date = (this.route.snapshot.paramMap.get('day'));
    this.viewDate = new Date(JSON.parse(date));

    this.timeslotsSub = this.timeslotsService.getDaySlots(JSON.parse(date))
      .subscribe(
        res => {
          console.log(res);
          const slots = res.slots.map(this.slot_to_event.bind(null, this.usersApi.currentUserValue.email));
          this.events = [
            ...slots
          ];
          console.log(this.events);
          this.nofReserved = this.events.length;
          },
        err => {
          console.log(err);
        });
  }

  slot_to_event(userId, slot) {
    const temp: any = {};

    temp.title = 'RESERVED';
    temp.start = new Date(slot.start);
    temp.end = new Date(slot.end);
    if (slot.user_id === userId) {
      temp.color = colors.green;
    } else {
      temp.color = colors.red;
    }

    return temp;
  }

  hourClicked(startDate: Date) {
    const nowDate = new Date();
    const endDate = new Date(startDate.getTime());
    endDate.setTime(endDate.getTime() + (60 * 60000));    // 1 hour slots
    if (!this.not_valid_date(startDate, endDate) && startDate >= nowDate) {

      const newEvent = {
        title: 'RESERVE',
        start: startDate,
        end: endDate,
        actions: this.actions,
        color: colors.blue,
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      };

      this.events = [
        ...this.events,
        newEvent
      ];
      console.log(this.events);
    }
  }

  saveTimeslots() {
    const newSlots: Slot = {slots: []};
    let newEvents: CalendarEvent[];

    newEvents = this.events.slice(this.nofReserved, this.events.length);
    newSlots.slots = newEvents.map(this.get_start_and_end_time);

    this.timeslotsSub = this.timeslotsService.save(newSlots)
      .subscribe(
        res => {
          this.events.splice(this.nofReserved, this.events.length - this.nofReserved);
          const slots = res.slots.map(this.saved_slot_to_event);
          this.events = [
            ...this.events,
            ...slots
          ];
          this.nofReserved += slots.length;
          },
        err => {
          console.log(err);
      });
  }

  saved_slot_to_event(slot) {
    const temp: any = {};

    temp.title = 'RESERVED';
    temp.start = new Date(slot.start);
    temp.end = new Date(slot.end);
    temp.color = colors.green;

    return temp;
  }

  get_start_and_end_time(slot) {
    const copiedStart = new Date(slot.start.getTime());
    const copiedEnd = new Date(slot.end.getTime());
    const start = copiedStart.toJSON();
    const end = copiedEnd.toJSON();
    return ({start, end});
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    renderEvent.body.hourGrid.forEach(hour => {
      hour.segments.forEach((segment, index) => {
        if (this.is_old_date(segment.date)) {
          segment.cssClass = 'cal-day-segment-disabled';
        }
      });
    });
  }

  not_valid_date(startDate, endDate) {
    return this.events.some( event => (event.start.getTime() <= startDate.getTime() && event.end.getTime() > startDate.getTime()) ||
      event.start.getTime() < endDate.getTime() && event.end.getTime() >= endDate.getTime());
  }

  is_old_date(date) {
    const today = new Date();
    return today > date;
  }

  onCancel() {
    this.router.navigate(['/calendar']);
  }
}
