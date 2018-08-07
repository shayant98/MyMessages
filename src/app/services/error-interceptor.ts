import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "../../../node_modules/rxjs/operators";
import { throwError } from "../../../node_modules/rxjs";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(){}
    intercept(req: HttpRequest<any>, next:HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                alert(error.error.message);
                return throwError(error)
                
            })
        )
    }
}