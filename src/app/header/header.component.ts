import { Component, OnInit } from '@angular/core';

import { UsersApiService } from '../_services/users-api.service';
import { UserAuth } from '../_models/userAuth';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  currentUser: UserAuth;

  constructor(private userApi: UsersApiService) {
    this.userApi.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {}

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logout() {
    this.userApi.logout();
  }

}

