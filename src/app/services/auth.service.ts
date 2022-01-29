import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty } from '@firebase/util';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor( public _afAuth: AngularFireAuth, public _afStore: AngularFirestore, public _router: Router, private _snackBar: MatSnackBar ) {  }

  signIn(email: any, password: any) {
    return this._afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this._router.navigate(['/chat']);
      }).catch((error) => {
        this._snackBar.open(error, "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      })
  }

  resetPassword(email: any) {
    return this._afAuth.sendPasswordResetEmail(email)
      .then((result) => {
        this._snackBar.open("Password Reset Link has been sent", "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      }).catch((error) => {
        this._snackBar.open(error, "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      })
  }

  createUser(email: any, password: any) {
    return this._afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // console.log(result)
        this._afStore.collection('users').doc(result.user.uid).set({
          uid: result.user.uid,
          name: "New User",
          avatar: "https://i1.wp.com/images.binaryfortress.com/General/UnknownUser1024.png"
        }).then((res) => {
          this._router.navigate(['/chat']);
          this._snackBar.open("Account successfully created", "dismiss", {panelClass: "errorSnackbar", duration: 3000});
        }).catch((err) => {
          console.log(err)
        })
      }).catch((error) => {
        this._snackBar.open(error, "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      })
  }

  signOut() {
    return this._afAuth.signOut()
      .then((result) => {
        this._router.navigate(['/auth']);
        this._snackBar.open("Logged out", "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      }).catch((error) => {
        console.log(error)
      })
  }

  googleAuth() {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  authLogin(provider: any) {
    return this._afAuth.signInWithPopup(provider).then((result) => {
      this._afStore.firestore.collection('users').doc(result.user.uid).get().then((ss) => {
        if (isEmpty(ss.data())) {
          const userRef = this._afStore.doc(`users/${result.user.uid}`);
          const userData = {
            uid: result.user.uid,
            name: result.user.displayName,  
            avatar: result.user.photoURL
          }
          userRef.set(userData, {
            merge: true
          })
        }
      });
      this._router.navigate(['/chat']);
    }).catch((error) => {
      this._snackBar.open(error, "dismiss", {panelClass: "errorSnackbar", duration: 3000});
    })
  }
}