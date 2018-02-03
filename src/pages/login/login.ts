import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  emailPlace:string;
  namePlace:string;
  signedUp: Boolean;



  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
      this.emailPlace = "Email";
      this.namePlace = "Full Name";
      this.user.password = "blackburn"
      this.signedUp = false;
 }

  async login(user: User){
    if (!this.signedUp){
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
          this.emailPlace = "Invalid Email";
        } else if (e.code == "auth/user-not-found") {
          this.register(user);
        }
      } 
    } else {
       if (user.name.length > 0){
         this.afAuth.auth.currentUser.updateProfile({
           displayName: user.name,
           photoURL: ""
         }).then(function(){
            this.navCtrl.setRoot('TabsPage');
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
            document.getElementById("email").classList.add("invisible");
            document.getElementById("name").classList.remove("invisible");
      }
    } catch (e) {
      console.error(e);
    }
  }

}