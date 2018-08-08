import {
  BrowserModule
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  NgModule
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule
} from '@angular/material';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http'


import {
  AppComponent
} from './app.component';
import {
  PostCreateComponent
} from './components/post-create/post-create.component';
import {
  HeaderComponent
} from './components/header/header.component';
import {
  PostListComponent
} from './components/post-list/post-list.component';
import {
  AppRoutingModule
} from './app-routing.module';
import {
  LoginComponent
} from './components/login/login.component';
import {
  SignupComponent
} from './components/signup/signup.component';
import {
  AuthInterceptor
} from './services/auth-interceptor';
import {
  ErrorInterceptor
} from './services/error-interceptor';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    HttpClientModule
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent
  ]
})
export class AppModule {}
