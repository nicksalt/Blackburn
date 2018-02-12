import { Component } from '@angular/core';
import {App, IonicPage, NavParams, Platform, ViewController} from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import {SettingsPage} from "../settings/settings";

/**
 * Generated class for the PopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
  template: `
    <ion-list>
      <button ion-item no-lines (click)="settings()">
        <ion-icon name="settings" item-start color="dark"></ion-icon>
        <ion-label>Settings</ion-label>
      </button>
      <button ion-item no-lines (click)="floorPlan()">
        <ion-icon name="home" item-start color="dark"></ion-icon>
        <ion-label>Floor Plan</ion-label>
      </button>
      <button ion-item no-lines (click)="virtualTour()">
        <ion-icon name="videocam" item-start color="dark"></ion-icon>
        <ion-label>Virtual Tour</ion-label>
      </button>
      <button ion-item no-lines (click)="close()">
        <ion-icon name="help-circle" item-start color="dark"></ion-icon>
        <ion-label>Help</ion-label>
      </button>
      <button ion-item no-lines (click)="close()">
        <ion-icon name="information-circle" item-start color="dark"></ion-icon>
        <ion-label>About</ion-label>
      </button>
    </ion-list>
    `
})
export class PopoverPage {

  constructor(public viewCtrl: ViewController, private navParams:NavParams, private app: App, private document: DocumentViewer, private platform:Platform) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  settings(){

    this.viewCtrl.dismiss();
    this.app.getRootNavs()[0].push('SettingsPage')
  }

  floorPlan(){
    this.viewCtrl.dismiss();
    if (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080')){
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument('assets/floorplan.pdf', 'application/pdf', options);
    } else {
      window.open('assets/floorplan.pdf', '_blank');
    }
  }

  virtualTour(){
    window.open('https://my.matterport.com/show/?m=JpyHEAYSpbg', '_system');
  }
}
