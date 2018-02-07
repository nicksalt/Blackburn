import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {ChatItem} from "../../models/chat-item";
import {MessageListService} from "../../services/message-list/message-list.service";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  encapsulation: ViewEncapsulation.None,

})

export class ChatPage {

  @ViewChild(Content) content: Content;

  messageItem$: Observable<ChatItem[]> = this.messages.pull();
  private messageListRef = this.database.list<ChatItem>('chat', ref => ref.orderByChild("time"));


  newMessage:ChatItem = {
    message: "",
    id: this.afAuth.auth.currentUser.refreshToken,
    time: undefined,
    name: this.afAuth.auth.currentUser.displayName
  };

  loadMin:number = 0;
  loadMax: number = 0;
  loadFactor:number = 15;
  constructor(private navCtrl: NavController, public navParams:NavParams, public element:ElementRef, private messages:MessageListService, private database: AngularFireDatabase, private afAuth: AngularFireAuth) {

    this.messageListRef.snapshotChanges().map(list=>list.length).subscribe(action => {
      console.log(this.loadMin + ' - ' + this.loadMax)
      this.content.scrollToBottom();
    });

    this.database.database.ref('chat').on("value", snapshot => {
        this.loadMax = snapshot.numChildren();
        if(this.loadMax - this.loadFactor > 0) {
          this.loadMin = this.loadMax - this.loadFactor;
        }
      });

  }

  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    if (textarea.scrollHeight < 85) {
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.overflowY = 'scroll';
    }
    return;
  }

  send(){
    this.newMessage.time = new Date().getTime();
    this.messages.push(this.newMessage);
    this.newMessage.message = "";
  }

testing(){
    if (this.loadMin - this.loadFactor > 0) {
      this.loadMin = this.loadMin - this.loadFactor;
    }
    this.loadFactor = this.loadFactor + 15;
}
}
