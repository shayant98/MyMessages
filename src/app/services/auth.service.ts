import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from "../models/Auth-Data.model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }


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
    this.http.post('http://localhost:3000/api/user/login', AuthData).subscribe(AuthResponse => {
      console.log(AuthResponse);
      
    })
  }
}
