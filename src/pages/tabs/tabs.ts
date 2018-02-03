import { ListsPage } from '../lists/lists';
import { ChatPage } from '../chat/chat';
import { CalendarPage} from '../calendar/calendar';


import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChatPage;
  tab2Root = ListsPage;
  tab3Root = CalendarPage;


  constructor() {

  }
}
