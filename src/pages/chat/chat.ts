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

  @ViewChild('content') content: Content;

  messageItem$: Observable<ChatItem[]> = this.messages.pull();
  private messageListRef = this.database.list<ChatItem>('chat', ref => ref.orderByChild("time"));


  message:ChatItem = {
    message: "",
    id: this.afAuth.auth.currentUser.refreshToken,
    time: undefined,
    name: this.afAuth.auth.currentUser.displayName
  };

  constructor(private navCtrl: NavController, public navParams:NavParams, public element:ElementRef, private messages:MessageListService, private database: AngularFireDatabase, private afAuth: AngularFireAuth) {

    this.messageListRef.snapshotChanges().subscribe(action => {
      this.content.scrollToBottom();
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
    this.message.time = new Date().getTime();
    this.messages.push(this.message);
    this.message.message = "";
  }


}
