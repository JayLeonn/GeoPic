import { CoordinatesPipe } from './../../pipes/coordinates/coordinates';
import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, UrlSerializer} from 'ionic-angular';
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {MediaProvider} from "../../providers/media/media";
import {HomePage} from "../home/home";
import {User} from "../../app/Interfaces/user";
import {SinglePage} from "../single/single";

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

  public buttonClicked: boolean = false; //Whatever you want to initialise it as
  status: string;
  title: string;
  loggedout: boolean;
  userInfo: any = ''; // here we store info about the user that is logged in

  userComments: any;
  userUploads: any;
  currentUser: string; // store username here

  loginErrorBoolean: boolean;
  succesfulSignUp: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider, private pipe: CoordinatesPipe) {
  }

  public onButtonClick() {
    this.buttonClicked = !this.buttonClicked;
  }

  ionViewWillEnter() {
    this.profilePageLoad();
  }

  profilePageLoad() {
    if (localStorage.getItem('token') !== null) {
      this.loggedout = false;
      this.title = 'Profile';
      try {
        this.mediaProvider.getCurrentUser(localStorage.getItem('token')).subscribe(data => {
          this.userInfo = data;
          this.currentUser = data['username'];
          console.log(this.userInfo);
        });
        this.loggedout = false;
      } catch(e) {
        console.log(e);
        this.loggedout = true;
      }

    } else {
      this.title = 'Login - Sign Up';
      this.loggedout = true;
    }
  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  getUserComments() {
    this.userComments = [];
    this.mediaProvider.getAllComments(localStorage.getItem('token')).subscribe(data => {
      this.userComments = data;
      this.userComments.reverse(); // get newest on top
    });
  }

  getUserUploads() {
    this.userUploads = [];
    this.mediaProvider.getPostsByUser(this.userInfo.user_id).subscribe(data => {
      this.userUploads = data;
      this.userUploads.reverse(); // get newest on top
    })
  }

  logout() {
    localStorage.removeItem('token');
    // empty usercomments and uploads when logging out
    this.userComments = [];
    this.userUploads = [];
    this.profilePageLoad();
  }

  login() {
    this.mediaProvider.login(this.loginUser).subscribe(response => {
      this.loginErrorBoolean = false;
      this.userInfo = response['user']; // get the "user" section of the response
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
      this.succesfulSignUp = true;
    });

  }
}
