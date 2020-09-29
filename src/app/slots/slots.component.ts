import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { TimeslotsApiService } from '../_services/timeslots-api.service';


@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css']
})
export class SlotsComponent implements OnInit {
  slots: any = [];
  timeslotsSub: Subscription;

  constructor(private router: Router,
              private timeslotsService: TimeslotsApiService) {}

  ngOnInit() {
    this.timeslotsSub = this.timeslotsService.getUserSlots()
      .subscribe(
        res => {
          const slots = res.slots.map(this.slot_to_event);
          slots.sort((a, b) => a.start.getTime() > b.start.getTime());
          this.slots = slots;
      },
        err => {
          console.log(err);
        });
  }

  slot_to_event(slot) {
    const temp: any = {};
    temp.start = new Date(slot.start);
    temp.end = new Date(slot.end);
    temp.id = slot._id;

    return temp;
  }

  experiment_valid_time(slot) {
    const today = new Date();
    return (today > slot.start && today < slot.end);
  }

  check_slot_start(event, slot) {
    if (!this.experiment_valid_time(slot)) {
      event.preventDefault();
    } else {
      this.router.navigate(['/slot', slot.id]);
    }
  }

  pad(t) {
    let st = '' + t;
    while (st.length < 2) {
      st = '0' + st;
    }
    return st;
  }

  isEmptyObject(slots) {
    return slots.length === 0;
  }

}
