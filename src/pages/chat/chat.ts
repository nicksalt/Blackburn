import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {App, Content, NavController, PopoverController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {ChatItem} from "../../models/chat-item";
import {MessageListService} from "../../services/message-list/message-list.service";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  encapsulation: ViewEncapsulation.None,

})

export class ChatPage {

  @ViewChild(Content) content: Content;

  messageItem$: Observable<ChatItem[]>;

  newMessage:ChatItem = {
    message: "",
    id: this.afAuth.auth.currentUser.uid,
    time: undefined,
    name: ''
  };

  public loadMin:number;
  public loadMax: number;
  messageText:HTMLElement;
  messageTextInitalHeight:number;
  private messages:MessageListService;



  constructor(private navCtrl: NavController, public popoverCtrl: PopoverController, public element:ElementRef, private database:AngularFireDatabase,
             private afAuth: AngularFireAuth, private app:App) {
    this.messages = MessageListService.getInstance(this.database);

    this.messageItem$ = this.messages.pull();

  }

  ionViewDidEnter(){
    this.messages.connect();
    this.messageItem$.subscribe(() =>{
      setTimeout(() => {
        this.goToBottom();
      }, 100)
    });
  }

  ionViewDidLeave(){
    this.messages.disconnect();
  }

  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    if (this.messageText == null){
      this.messageText = textarea;
      this.messageTextInitalHeight = textarea.scrollHeight;
    }
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
    this.newMessage.name = this.afAuth.auth.currentUser.displayName;
    this.messages.push(this.newMessage);
    this.newMessage.message = "";
    if (this.messageText != null) {
      this.messageText.style.height = this.messageTextInitalHeight + 'px';
    }

  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('PopoverPage', this);
    popover.present({
      ev: myEvent
    });
  }

  test(){
    console.log(this.loadMin + ' ' + this.loadMax);
    console.log(this.content.scrollHeight + " " + this.content.contentHeight + " " + this.content.scrollTop + " " + this.content._ftrHeight + " " + this.content._hdrHeight)
    console.log(document.getElementById('chat-list').childElementCount);
  }

   goToBottom(){
    try {
        this.content.scrollToBottom();

    } catch (e) {
      console.log(e);
    }
  }

  getColor(id){
    return this.messages.getColors()[id]
  }

  timeToDate(time){
    let messageDate = new Date(time);
    let rightNow = new Date();
    let ampm = messageDate.getHours() >=12 ? 'PM':'AM';
    let hours = (messageDate.getHours()%12 == 0? 12: messageDate.getHours()%12);
    let minutes = (messageDate.getMinutes()<10?'0':'');
    console.log()

    if (messageDate.toDateString() == rightNow.toDateString()){
      return "Today, " + hours+":"+ minutes + messageDate.getMinutes()+ampm;
    }
    rightNow.setDate(rightNow.getDate() - 1);
    if (messageDate.toDateString() == rightNow.toDateString()) {
      return "Yesterday, " + hours + ":" + minutes + messageDate.getMinutes() + ampm;
    }
    let date = messageDate.toLocaleDateString();
    if (date.charAt(0) != '1'){
      date = '0'+ date
    }
    if (date.charAt(4) == '/') {
      date = date.substring(0, 3) + '0' + date.substring(3);
    }
    date = date.substring(0,6) + date.substring(8);
    return date+', ' + hours + ":" + minutes + messageDate.getMinutes() + ampm;
  }

}
