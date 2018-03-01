import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, UrlSerializer} from 'ionic-angular';
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {MediaProvider} from "../../providers/media/media";
import {HomePage} from "../home/home";
import {User} from "../../app/Interfaces/user";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loginUser: User = {
    username: '',
    password: '',
    email: ''
  };

  newUser: User = {
    username: '',
    password: '',
    email: '',
    full_name: ''
  };

  status: string;
  title: string;
  loggedout: boolean;

  userInfo: any = '';

  loginErrorBoolean: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider) {
  }

  ionViewWillEnter() {
    if (localStorage.getItem('token') !== null) {
      this.loggedout = false;
      this.title = 'Profile';
    } else {
      this.title = 'Login - Sign Up';
      this.loggedout = true;
    }
  }

  login() {
    this.mediaProvider.login(this.loginUser).subscribe(response => {
      this.loginErrorBoolean = false;
      this.userInfo = response['user'];
      console.log(this.userInfo);
      localStorage.setItem('token', response['token']); // add access token for user in the localstorage
      this.navCtrl.parent.select(0); // navigate to homepage
    }, (error: HttpErrorResponse) => {
      this.status = error.error.message;
      this.loginErrorBoolean = true;
    });

  }

  register() {
    this.mediaProvider.register(this.newUser).subscribe(response => {
      this.loginUser = this.newUser;
      this.login();
    });

  }
}
