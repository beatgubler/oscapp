import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from "../../services/auth.service";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy  {
  
  userData: any;
  localProvider: boolean;

  uploadImage: any;
  uploadImageName: any;

  usernameValue: any;
  passwordValue: any;
  avatarValue: any;

  usersSubscription: any;
  authSubscription: any;

  constructor( public _profileService: ProfileService, public _afAuth: AngularFireAuth, public _afStorage: AngularFireStorage, public _afStore: AngularFirestore, private _snackBar: MatSnackBar ) { 
    this.authSubscription = this._afAuth.authState.subscribe(user => {
      if (user) {
        if (user.providerData[0].providerId === 'password') {
          this.localProvider = true
        } else {
          this.localProvider = false
        }
        this.usersSubscription = this._afStore.collection('users').doc(user.uid).snapshotChanges().subscribe((ss) => {
          this.userData = ss.payload.data();
        });
      } else {
        this.userData = null
        this.localProvider = false
      }
    })
  }

  setUploadImage = (event) => {
    if (event.target.files[0].size < 2000000) {
      if (event.target.files[0].type === "image/png" || event.target.files[0].type === "image/jpg" || event.target.files[0].type === "image/jpeg") {
        this.uploadImage = event.target.files[0]
        this.uploadImageName = event.target.files[0].name
      } else {
        this.avatarValue = null
        this.uploadImage = null
        this.uploadImageName = "Wrong file type"
      }
    } else {
      this.avatarValue = null
      this.uploadImage = null
      this.uploadImageName = "Filesize too big"
    }
  }

  ngOnInit(): void {
    this.uploadImageName = "Please select a new image..."
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
