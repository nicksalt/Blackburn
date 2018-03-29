import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import {UserDevice} from "../../models/user-device";
import {Device} from "@ionic-native/device";
import {AngularFireDatabase} from "angularfire2/database";


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

  userDevice = {} as UserDevice;
  user = {} as User;
  emailPlace:string;
  namePlace:string;
  passwordPlace:string;
  signedUp: Boolean;


  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController, private device:Device, private database:AngularFireDatabase) {
      this.emailPlace = "";
      this.namePlace = "";
      this.passwordPlace = "";
      this.signedUp = false;
      console.log(this.device);

      this.userDevice.manufacturer = this.device.manufacturer;
      this.userDevice.platform = this.device.platform;
      this.userDevice.version = this.device.version;
      this.userDevice.model = this.device.model;
      this.userDevice.isVirtual = this.device.isVirtual;

  }

  ionVeiwDidLoad(){
  }

  async login(user: User){
    console.log(user.email + " " + user.password + " " + user.name);
    if (!this.signedUp){
      console.log("run");
      try {
        const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
        if (result) {
          this.openApp();
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
          this.showAlert("That's not your password. If you forgot it press below and I'll send you a new one.", true);
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
         }).then(() => {
           this.openApp();
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
      console.error(e.code);
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
    this.showAlert("Enter a name to be used in the app. Don't worry you can change this whenever you want. It will be used in the chat, " +
      "list, and calendar... so preferably make it your actual name.", true, "Last Step!");
    this.signedUp = true;
  }

  forgotPassword(){
    try {
      const result = this.afAuth.auth.sendPasswordResetEmail(this.user.email);
      if (result) {
        this.showAlert("We've send you a password reset link to your email. Check your inbox for an email from noreply@blackburn-1998.firebaseapp.com", true, "Password reset send!")
      }
    } catch (e) {
      console.log(e.code);
      if (e.code == "auth/invalid-email" || "auth/argument-error"){
        this.showAlert("Please enter a valid email.", true, "Email Issue")
      } else if (e.code == "auth/user-not-found") {
        this.showAlert("Your not a user yet! Enter a password to complete the sign up." + this.user.email, true, "Hey, wait a minute...")

      }
    }

  }

  openApp(){
    let TOKEN_ID = "TOKEN ID 2";
    let userRef = this.database.object("users/" + this.afAuth.auth.currentUser.uid + "/" +  TOKEN_ID);
    userRef.set(this.userDevice).then(() => {
      console.log(this.userDevice);
    });
    this.signedUp=true;
    this.navCtrl.setRoot('TabsPage');
  }



}
