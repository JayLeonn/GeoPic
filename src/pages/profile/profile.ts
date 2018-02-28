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

  user: User = {
    username: '',
    password: '',
    email: ''
  };

  status: string;
  title: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
    if (localStorage.getItem('token') !== null) {
      document.getElementById('loggedout').classList.add('hidden');
      this.title = 'Profile';
    } else {
      this.title = 'Login - Sign Up';
    }
  }

  login() {
    this.mediaProvider.login(this.user).subscribe(response => {
      localStorage.setItem('token', response['token']);
      this.navCtrl.push(HomePage);
    }, (error: HttpErrorResponse) => {
      this.status = error.error.message;
    });

  }

  register() {
    this.mediaProvider.register(this.user)
  }

}
