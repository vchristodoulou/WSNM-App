import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../env';
import { NodeType } from '../_models/nodeType';


@Injectable({
  providedIn: 'root'
})
export class NodetypesApiService {
  httpOptionsJson = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  retrieve() {
    return this.http.get<any>(`${API_URL}/nodetypes/`);
  }
}
