import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebSocketService } from './web-socket.service';
import { WS_URL, API_URL } from '../env';


@Injectable({
  providedIn: 'root'
})
export class DebugApiService {
  dataSub: Subject<any>;
  httpOptionsJson = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient,
              private wsService: WebSocketService) {}

  startDebugChannel(slotId): Observable<any> {
    this.dataSub = this.wsService.connect()
      .pipe(map(response => {
        console.log(response);
        return response;
      })) as Subject<any>;
    return this.http.post<any>(`${API_URL}/debug/start`, slotId, this.httpOptionsJson);
  }

  endDebugChannel(slotId): Observable<any> {
    this.dataSub.unsubscribe();
    return this.http.post<any>(`${API_URL}/debug/end`, slotId, this.httpOptionsJson);
  }

  clearLog(slotId): Observable<HttpResponse<null>> {
    return this.http.post<any>(`${API_URL}/debug/clear_log`, slotId, this.httpOptionsJson);
  }

  downloadLog(slotId): Observable<any> {
    return this.http.post<any>(`${API_URL}/debug/download_log`, slotId, {responseType: 'blob' as 'json'});
  }

  getLog(url) {
    return this.http.get(url, {responseType: 'blob'});
  }

}
