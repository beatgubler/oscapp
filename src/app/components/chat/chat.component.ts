import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, ViewChildren, QueryList, OnDestroy  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('container') myScrollContainer: ElementRef;

  container: HTMLElement;

  messageValue: any;
  messages: any[] = [];
  scrolling: boolean;

  userData: any;

  usersSubscription: any;
  messagesSubscription: any;
  authSubscription: any;

  constructor( public _chatService: ChatService, public _afAuth: AngularFireAuth, public _afStore: AngularFirestore ) { 
    this.authSubscription = this._afAuth.authState.subscribe(user => {
      if (user) {
        this.usersSubscription = this._afStore.collection('users').doc(user.uid).snapshotChanges().subscribe((ss) => {
          this.userData = ss.payload.data();
        });
      } else {
        this.userData = null;
      }
    })
  }

  ngOnInit(): void { 
    this.getMessages() 
    this.scrolling = true;
  }

  ngAfterViewChecked() {
    if (this.scrolling) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight
    }
  }
    
  getMessages = () => {
    this.messagesSubscription = this._chatService.getMessages().subscribe((ss) => {
      this.messages = ss;
    });
  }

  toggleScrolling = () => {
    this.scrolling = !this.scrolling
  }

  submitHandler = (message) => {
    this._chatService.postMessage(this.userData.uid, this.userData.name, message, this.userData.avatar)
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
