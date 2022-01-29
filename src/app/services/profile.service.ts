import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  userData: any;

  userMessages: any;
  uploadImage: any;
  uploadImageName: any;

  avatarURL: string;
  avatarValue: any;

  constructor( public _afAuth: AngularFireAuth, public _afStorage: AngularFireStorage, public _afStore: AngularFirestore, private _snackBar: MatSnackBar ) {  }

  updateUsername(uid, enteredUsername) {
    this._afStore.collection('users').doc(uid).update({
      name: enteredUsername
    })
    this._afStore.firestore.collection('messages').where('uid', '==', uid).get().then((ss) => {
      this.userMessages = ss.docs;
      this.userMessages.forEach(message => {
        this._afStore.collection('messages').doc(message.id).update({
          name: enteredUsername
        })
      })
      this._snackBar.open("Username updated", "dismiss", {panelClass: "errorSnackbar", duration: 3000});
    })
  }

  updatePassword(enteredPassword) {
    this._afAuth.currentUser.then((res) => {
      res.updatePassword(enteredPassword).then((res) => {
        this._snackBar.open("Password updated", "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      }).catch((err) => {
        this._snackBar.open(err, "dismiss", {panelClass: "errorSnackbar", duration: 3000});
      })
    }).catch((err) => {
      this._snackBar.open(err, "dismiss", {panelClass: "errorSnackbar", duration: 3000});
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

  upload(uid, uploadImage) {
    this._afStorage.upload('/upload/avatars/' + uid, uploadImage).then((result) => {
      result.ref.getDownloadURL().then((ss) => {
        this.avatarURL = ss
        this._afStore.collection('users').doc(uid).update({
          avatar: this.avatarURL
        })
        this._afStore.firestore.collection('messages').where('uid', '==', uid).get().then((ss) => {
          this.userMessages = ss.docs;
          this.userMessages.forEach(message => {
            this._afStore.collection('messages').doc(message.id).update({
              avatar: this.avatarURL
            })
          })
          this._snackBar.open("Image updated", "dismiss", {panelClass: "errorSnackbar", duration: 3000});
        })
      })
      
    })
  }

}