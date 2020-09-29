import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import { UserAuth } from '../_models/userAuth';
import { API_URL } from '../env';


@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private currentUserSubject: BehaviorSubject<UserAuth>;
  public currentUser: Observable<UserAuth>;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<UserAuth>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserAuth {
    return this.currentUserSubject.value;   // Object {token, email}
  }

  signup(user: User): Observable<any> {
    return this.http.post<any>(`${API_URL}/users/`, user , this.httpOptions);
  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${API_URL}/users/login`, user, this.httpOptions)
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // user = {token, email}
        localStorage.setItem('currentUser', JSON.stringify({token: res.token, email: user.email}));
        this.currentUserSubject.next({token: res.token, email: user.email});
        console.log(this.currentUserValue);
        return res.token;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

}
