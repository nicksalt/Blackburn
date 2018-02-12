import { Component } from '@angular/core';
import {Alert, AlertController, App, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {MessageListService} from "../../services/message-list/message-list.service";
import {async} from "rxjs/scheduler/async";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  email:string;
  name:string;
  emailPrompt:Alert;
  newPasswordPrompt:Alert;

  constructor(private alertCtrl: AlertController, private afAuth:AngularFireAuth, private app: App, private toastCtrl:ToastController) {

    try {
      this.email = afAuth.auth.currentUser.email;
      this.name = afAuth.auth.currentUser.displayName;
    } catch (e) {
      console.log(e)
    }
  }

  ionViewDidEnter() {

  }

  signOut(){
    MessageListService.getInstance().disconnect();
    this.afAuth.auth.signOut();
    this.app.getRootNavs()[0].setRoot("LoginPage");
  }

  changeEmail(){
    this.emailPrompt = this.alertCtrl.create({
      title: 'Change email',
      message: "Enter a new email address that you would like to associate with your account.",
      inputs: [
        {
          name: 'newEmail',
          type: 'email',
          placeholder: this.afAuth.auth.currentUser.email,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let toast;
            this.afAuth.auth.currentUser.updateEmail(data.newEmail).then(() => {
              this.email = this.afAuth.auth.currentUser.email;
              toast = this.toastCtrl.create({
                message: 'Success!',
                duration: 3000,
                position: 'bottom',
              });
              toast.present();
            }).catch(e => {
              if (e.code == 'auth/email-already-in-use'){
                toast = this.toastCtrl.create({
                  message: 'This email address is already associated with another account.',
                  duration: 3000,
                  position: 'bottom',
                });
              } else if (e.code == 'auth/invalid-email') {
                toast = this.toastCtrl.create({
                  message: 'Invalid email.',
                  duration: 3000,
                  position: 'bottom',
                });
              }
              toast.present();
            });

          }
        }
      ]
    });
      this.emailPrompt.present();
      this.enterPassword();

  }

  changeDisplayName(){
    let prompt = this.alertCtrl.create({
      title: 'Enter Name',
      message: "Enter a new name.",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.afAuth.auth.currentUser.displayName,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let toast = this.toastCtrl.create({
              message: 'Unable to update name',
              duration: 3000,
              position: 'bottom',
            });
            if (data.name.length > 0) {
              this.afAuth.auth.currentUser.updateProfile({
                displayName: data.name,
                photoURL: ""
              }).then(() => {
                this.name = this.afAuth.auth.currentUser.displayName;
                toast.setMessage("Success!");
                toast.present();
              }).catch(e => {
                console.log(e);
                toast.present()
              })
            } else {
              toast.present();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  changePassword(){
    this.newPasswordPrompt = this.alertCtrl.create({
      title: 'Enter Password',
      message: "Enter a new password.",
      inputs: [
        {
          name: 'password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Next',
          handler: data => {
            let toast;
            this.afAuth.auth.currentUser.updatePassword(data.password).then(() => {
              let toast = this.toastCtrl.create({
                message: 'Success!',
                duration: 3000,
                position: 'bottom',
              });
              toast.present()
            }).catch(e => {
              console.log(e.code);
              let toast = this.toastCtrl.create({
                message: 'Unable to update password.',
                duration: 3000,
                position: 'bottom',
              });
              toast.present()
            })
          }
        }
      ]
    });
    this.newPasswordPrompt.present();
    this.enterPassword();
  }
  enterPassword(){
    let prompt = this.alertCtrl.create({
      title: 'Enter Password',
      message: "Enter your current password to continue.",
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            if (this.emailPrompt != null) {
              this.emailPrompt.dismiss();
            }
            if (this.newPasswordPrompt != null) {
              this.newPasswordPrompt.dismiss();
            }
          }
        },
        {
          text: 'Next',
          handler: data => {
            this.afAuth.auth.signInWithEmailAndPassword(this.afAuth.auth.currentUser.email, data.password).then(()=>{
            }).catch(e => {
              if (e.code == "auth/wrong-password"){
                let toast = this.toastCtrl.create({
                  message: 'Wrong Password',
                  duration: 3000,
                  position: 'bottom',
                });
                toast.present();
              }
              if (this.emailPrompt != null) {
                this.emailPrompt.dismiss();
              }
              if (this.newPasswordPrompt != null) {
                this.newPasswordPrompt.dismiss();
              }
            });

          }
        }
      ]
    });

    prompt.present();
  }

}
