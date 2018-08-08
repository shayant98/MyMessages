import { CanActivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,private router: Router){

    }
    canActivate(){
        const isAuth = this.authService.getIsAuth()
        if(!isAuth){
            this.router.navigate(['/login']);
        }
        return isAuth;
    }

}