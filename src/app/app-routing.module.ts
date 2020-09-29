import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { ImagesComponent } from './images/images.component';
import { SlotsComponent } from './slots/slots.component';
import { ExperimentComponent } from './experiment/experiment.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DebugComponent } from './debug/debug.component';
import { AuthGuard } from './_helpers/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'calendar/:day', component: CalendarDayComponent, canActivate: [AuthGuard] },
  { path: 'images', component: ImagesComponent, canActivate: [AuthGuard] },
  { path: 'slots', component: SlotsComponent, canActivate: [AuthGuard] },
  { path: 'slot/:id', component: ExperimentComponent, canActivate: [AuthGuard] },
  { path: 'debug', component: DebugComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
