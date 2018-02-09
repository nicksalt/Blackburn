import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

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
      <button ion-item no-lines (click)="close()">
        <ion-icon name="settings" item-start color="dark"></ion-icon>
        <ion-label>Settings</ion-label>
      </button>
      <button ion-item no-lines (click)="close()">
        <ion-icon name="home" item-start color="dark"></ion-icon>
        <ion-label>Floor Plan</ion-label>
      </button>
      <button ion-item no-lines (click)="close()">
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

  constructor(public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
