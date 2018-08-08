import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false
  private authStateListenerSubs = new Subscription
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated =  this.authService.getIsAuth();
    this.authStateListenerSubs = this.authService.getauthStateListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
   this.authStateListenerSubs.unsubscribe();
  }

}
