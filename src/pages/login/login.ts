import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  emailPlace:string;
  namePlace:string;
  passwordPlace:string;
  signedUp: Boolean;



  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
      this.emailPlace = "";
      this.namePlace = "";
      this.passwordPlace = "";
      this.signedUp = false;


      }


  async login(user: User){
    console.log(user.email + " " + user.password + " " + user.name);
    if (!this.signedUp){
      console.log("run");
      try {
        const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
        if (result) {
          this.signedUp=true;
          this.navCtrl.setRoot('TabsPage');
        }
      }
      catch (e) {
        if (e.code == "auth/invalid-email") {
          user.email = "";
          this.showAlert("Your email format is invalid. Make sure you have an @ address and a domain extension (e.g. .com)", true);
        } else if (e.code == "auth/user-not-found") {
          this.register(user);
        } else if (e.code == "auth/wrong-password") {
          user.password = "";
          this.showAlert("That's not your password. If you forget it press below and I'll send you a new one.", true);
        }
      }
    } else {
       if (user.name.length > 0){
         console.log(user.name);
         let controller = this.navCtrl;
         let funcCall = this;
         this.afAuth.auth.currentUser.updateProfile({
           displayName: user.name,
           photoURL: ""
         }).then(function() {
           funcCall.showAlert("You ready for an awesome app!", false);
            controller.setRoot('TabsPage')
         }).catch(function(error){
           console.error(error);
         });
       }

    }
  }

  async register(user: User) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {
            this.displayName();
      }
    } catch (e) {
      console.error(e);
    }
  }

  showAlert(message, isBasic, title?){
    if (isBasic) {
      if (title == null){
        title = 'Login Issue';
      }
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  displayName(){
    document.getElementById("email").classList.add("invisible");
    document.getElementById("password").classList.add("invisible");
    document.getElementById("name").classList.remove("invisible");
    document.getElementById("forgot-password").classList.add("invisible");
    this.showAlert("Enter a name to be used in the app, you can change this whenever you want. It will be used in the chat, " +
      "list, and calendar. So preferably make it your actual name.", true, "Enter your Name");
    this.signedUp = true;
  }

}
