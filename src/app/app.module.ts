import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { SlotsComponent } from './slots/slots.component';
import { NodesComponent } from './nodes/nodes.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { DebugComponent } from './debug/debug.component';
import { ImagesComponent } from './images/images.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageDeleteComponent } from './image-delete/image-delete.component';
import { ExperimentComponent } from './experiment/experiment.component';


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CalendarDayComponent,
    SlotsComponent,
    NodesComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    DebugComponent,
    ImagesComponent,
    ImageUploadComponent,
    ImageDeleteComponent,
    ExperimentComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FileUploadModule,
    NgbModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
