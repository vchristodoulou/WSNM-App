import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { Node } from '../_models/node';

import { API_URL } from '../env';


@Injectable({
  providedIn: 'root'
})
export class NodesApiService {
  httpOptionsJson = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  retrieve() {
    return this.http.get<any>(`${API_URL}/nodes/`);
  }

  flash(data): Observable<any> {
    return this.http.post<any>(`${API_URL}/nodes/flash`, data, this.httpOptionsJson);
  }

  reset(data): Observable<any> {
    return this.http.post<any>(`${API_URL}/nodes/reset`, data, this.httpOptionsJson);
  }

  erase(data): Observable<any> {
    return this.http.post<any>(`${API_URL}/nodes/erase`, data, this.httpOptionsJson);
  }
}
