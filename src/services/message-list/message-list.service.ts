import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {ChatItem} from "../../models/chat-item";

@Injectable()
export class MessageListService {

  private messageListRef = this.database.list<ChatItem>('chat', ref => ref.orderByChild("time"));
  constructor(private database: AngularFireDatabase) {
  }

  push(newMessage: ChatItem){
    this.messageListRef.push(newMessage);
  }

  pull(){
    return this.messageListRef
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val(),
        }));
      });
  }

}
