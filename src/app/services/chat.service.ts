import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  constructor( public _afStore: AngularFirestore ) {  }

  postMessage(uid, name, message, avatar) {
    const timestamp = Math.floor(Date.now() / 1000);
    this._afStore.collection("messages").add({
      uid: uid, 
      name: name, 
      createdOn: timestamp, 
      message: message, 
      avatar: avatar
    }).then((res) => {
      // console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }

  deleteMessage(id) {
    this._afStore.collection("messages").doc(id).delete()
  }

  getMessages() {
    return this._afStore.collection("messages", ref => ref.orderBy('createdOn')).snapshotChanges();
  }

}