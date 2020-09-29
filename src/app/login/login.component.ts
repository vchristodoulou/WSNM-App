import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {finalize, first} from 'rxjs/operators';

import { UsersApiService } from '../_services/users-api.service';
import { User } from '../_models/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userSub: Subscription;
  user: User = {email: '', username: '', password: ''};
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  loginError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usersApi: UsersApiService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email ] ],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onLoginSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;


    this.user.email = this.f.email.value;
    this.user.password = this.f.password.value;
    this.userSub = this.usersApi.login(this.user)
      .pipe(
        first(),
        finalize(() => this.loading = false))
      .subscribe(
        token => {
          console.log(token);
          this.router.navigate(['/calendar']);
        },
        err => {
          console.log(err);
          this.loginError = true;
          setTimeout(() => {
            this.loginError = false;
          }, 4000);
          this.f.email.setValue('');
          this.f.password.setValue('');
        });
  }

}
