import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../env';


@Injectable({
  providedIn: 'root'
})
export class StatusApiService {

  constructor(private http: HttpClient) {}

  task_status(taskName, taskId): Observable<any> {
    return this.http.get<any>(`${API_URL}/status/` + taskName + '/' + taskId);
  }
}
