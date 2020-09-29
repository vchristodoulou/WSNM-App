import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first, finalize } from 'rxjs/operators';

import { UsersApiService } from '../_services/users-api.service';
import { User } from '../_models/user';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  userSub: Subscription;
  user: User = {email: '', username: '', password: ''};
  signupForm: FormGroup;
  loading = false;
  signupError = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private usersApi: UsersApiService) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email ] ],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.signupForm.controls; }

  onSignupSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }
    this.loading = true;

    this.user.email = this.f.email.value;
    this.user.username = this.f.username.value;
    this.user.password = this.f.password.value;
    this.userSub = this.usersApi.signup(this.user)
      .pipe(
        first(),
        finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        err => {
          console.log(err);
          this.signupError = true;
          setTimeout(() => {
           this.signupError = false;
          }, 4000);
          this.f.email.setValue('');
          this.f.username.setValue('');
          this.f.password.setValue('');
        });
  }

}

