import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { API_URL } from '../env';


@Injectable({
  providedIn: 'root'
})
export class ImagesApiService {
  httpOptionsJson = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  retrieve() {
    return this.http.get<any>(`${API_URL}/images/`);
  }

  delete(name: string) {
    return this.http.delete<any>(`${API_URL}/images/` + name);
  }
}
