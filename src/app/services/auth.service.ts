import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from "../models/Auth-Data.model";
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false
  private token: string;
  private authStateListener = new Subject<boolean>();
  private tokenTimer: any;
  constructor(private router: Router, private http: HttpClient) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getauthStateListener(){
    return this.authStateListener.asObservable();
  }

  createUser(email: string, password: string){
    const AuthData: AuthData = {
      email: email,
      password: password
    }
    this.http.post('http://localhost:3000/api/user/signup', AuthData).subscribe(AuthResponse => {
      console.log(AuthResponse);
      
    })
  }

  loginUser(email: string, password: string){
    const AuthData: AuthData = {
      email: email,
      password: password
    }
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', AuthData).subscribe(AuthResponse => {
      const token = AuthResponse.token
      this.token = token
      if(token){
        const expriresInDuration = AuthResponse.expiresIn;        
       this.setAuthTimer(expriresInDuration)
        this.isAuthenticated = true;
        this.authStateListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expriresInDuration * 1000)
        this.saveAuthData(token, expirationDate)
        this.router.navigate(['/']);
      }
      
      
    })
  }

  autoAuthUser(){
    const authInformation  = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      this.token = authInformation.token
      this.isAuthenticated = true;
        this.authStateListener.next(true);
        this.setAuthTimer(expiresIn / 1000) 
    }
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.clearAuthData()
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout()
   }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString())
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if(!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
