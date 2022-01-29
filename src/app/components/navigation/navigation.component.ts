import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{

  email: any;


  constructor(public _afAuth: AngularFireAuth, public _authService: AuthService) { 
    this._afAuth.authState.subscribe(user => {
      if (user) {
        this.email = user.email
      } else {
        this.email = null
      }
    })
  }

  // logout = () => {
  //   this.email = null
  //   this.authService.signOut()
  // }

  ngOnInit(): void {
    
  }
}
