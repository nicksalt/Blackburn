import {Injectable} from "@angular/core";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {ChatItem} from "../../models/chat-item";
import {Observable} from "rxjs/Observable";
import {AngularFireModule, FirebaseApp} from "angularfire2";
import {FIREBASE_CONFIG} from "../../app/app.firebase.config";

@Injectable()
export class MessageListService {

  test:number = 0;
  list:Observable<ChatItem[]>;
  static instance:MessageListService;
  messageListRef:AngularFireList<ChatItem>;
  colors:string[] = ['red','dodgerblue','blueviolet','darkorange','lightgreen', 'lightcoral', 'tomato', 'navy', 'teal'];
  private colorName:{[key:string]:string} = {};
  colorIndex = 0;

   private constructor(private database:AngularFireDatabase) {
     this.messageListRef = database.list<ChatItem>('chat', ref => ref.orderByChild("time"));
     this.list = this.messageListRef
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...this.setColors(c.payload.val()),
        }));
      });
  }

  static getInstance(database?){
     if (this.instance == null){
       this.instance = new MessageListService(database);
     }
     return this.instance;
  }

  push(newMessage: ChatItem){
    this.messageListRef.push(newMessage);
  }

  pull(){
    return this.list;
  }

  disconnect(){
     this.database.database.goOffline();
  }

  connect(){
     this.database.database.goOnline();
  }

  setColors(chatItem){
    if (this.colorName[chatItem.id] == null){
      this.colorName[chatItem.id] = this.colors[this.colorIndex];
      this.colorIndex++;
      if (this.colorIndex > this.colors.length - 1){
        this.colorIndex = 0;
      }
    }
     return chatItem;
  }

  getColors():{[key:string]:string}{
     return this.colorName;
  }
}
