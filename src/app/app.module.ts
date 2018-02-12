import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ListsPage } from '../pages/lists/lists';
import { ChatPage } from '../pages/chat/chat';
import { CalendarPage} from '../pages/calendar/calendar';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { FIREBASE_CONFIG } from "./app.firebase.config";
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {MessageListService} from "../services/message-list/message-list.service";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {LoginPageModule} from "../pages/login/login.module";
import {SettingsPage} from "../pages/settings/settings";
import {SettingsPageModule} from "../pages/settings/settings.module";

@NgModule({
  declarations: [
    MyApp,
    ListsPage,
    ChatPage,
    CalendarPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    TabsPageModule,
    LoginPageModule,
    SettingsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListsPage,
    ChatPage,
    CalendarPage,
    TabsPage,
    LoginPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MessageListService,
    DocumentViewer
  ]
})
export class AppModule {}
