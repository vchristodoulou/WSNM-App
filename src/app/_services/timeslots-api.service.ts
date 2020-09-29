import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { API_URL } from '../env';
import { TimeSlot } from '../_models/timeSlot';


@Injectable({
  providedIn: 'root'
})
export class TimeslotsApiService {
  httpOptionsJson = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  save(slots: {slots: TimeSlot[]}): Observable<any> {
    return this.http.post<any>(`${API_URL}/timeslots/`, slots, this.httpOptionsJson);
  }

  getDaySlots(date): Observable<any> {
    const params = new HttpParams().set('date', date);
    return this.http.get<any>(`${API_URL}/timeslots/day`, {params});
  }

  getUserSlots(): Observable<any> {
    return this.http.get<any>(`${API_URL}/timeslots/user`);
  }
}
