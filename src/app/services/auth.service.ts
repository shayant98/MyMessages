import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Router
} from '@angular/router';
import {
  AuthData
} from "../models/Auth-Data.model";
import {
  Subject
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false
  private token: string;
  private authStateListener = new Subject < boolean > ();
  private tokenTimer: any;
  private userId: string
  constructor(private router: Router, private http: HttpClient) {}

  /*
  getter voor login token, 
  dit is de functie die gebruikt wordt in andere components om de login token op te halen. 
  hier ben je dan zeker dat je aleen de token opstuurd en geen extra informatie.
  */

  getToken() { 
    return this.token;
  }


  /*
  getter voor auth status van gebruiker, 
  dit is de functie die gebruikt wordt in andere components om de status op te halen. 
  */
  getIsAuth() { 
    return this.isAuthenticated;
  }

  /*
  getter voor userid van gebruiker, 
  dit is de functie die gebruikt wordt in andere components om de userid op te halen. 
  */
  getUserId() { 
    return this.userId
  }

  /*
  Deze functie wordt opgeroepen indien de auth status veranderd moet worden(val ingelog naar uitgelogd of omgekeerd)....zijn booleans
  */
  getauthStateListener() {
    return this.authStateListener.asObservable();
  }

  /*
  gebruikers creatie functie
  */
  createUser(email: string, password: string) {
    const AuthData: AuthData = {
      email: email,
      password: password
    }
    this.http.post('http://localhost:3000/api/user/signup', AuthData).subscribe(AuthResponse => {
      this.router.navigate(['/']);
    }, error => {
      this.authStateListener.next(false)
    })
  }

  /*
  inlog functie
  indien er een token van de backend komt, zal de 
   - isauthenticted gezet worden op true
   - the auto uitlog timer zal gezet worden(hoelang komt van de backend)
   - de userid zal gezet worden(komt vanuit backend)
   - de authlistener wordt geupdate naar 'true', zodat de verandering gelijk gerefecteerd worden op de scherm van de gebruiker.
   - en localstorage met de token, vervaldatum van de sessie en de userid worden opgeslagen in de browser 
  */
  loginUser(email: string, password: string) {
    const AuthData: AuthData = {
      email: email,
      password: password
    } //ontvangen data in een constante gezet
    this.http.post < {
      token: string,
      expiresIn: number,
      userId: string
    } > ('http://localhost:3000/api/user/login', AuthData).subscribe(AuthResponse => {
      const token = AuthResponse.token
      this.token = token
      if (token) {
        const expriresInDuration = AuthResponse.expiresIn;
        this.setAuthTimer(expriresInDuration)
        this.isAuthenticated = true;
        this.userId = AuthResponse.userId
        this.authStateListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expriresInDuration * 1000)
        this.saveAuthData(token, expirationDate, this.userId)
        this.router.navigate(['/']);
      }


    }, error => {
      this.authStateListener.next(false)
    })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.authStateListener.next(true);
      this.setAuthTimer(expiresIn / 1000)
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    this.clearAuthData()
    this.userId = null
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId')

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
