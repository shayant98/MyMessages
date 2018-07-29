import { CanActivate, Router } from "../../../node_modules/@angular/router";
import { Injectable } from "../../../node_modules/@angular/core";
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