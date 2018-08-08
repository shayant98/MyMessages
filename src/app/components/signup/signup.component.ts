import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false
  authStatusSub: Subscription
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getauthStateListener().subscribe(authstatus => {
      this.isLoading = false
    })
  }

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }else{
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password);
    }
   
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
