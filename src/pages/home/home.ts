import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MediaProvider} from "../../providers/media/media";
import {SinglePage} from "../single/single";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //splash screen
  splash = true;
  tabBarElement: any;

  mediaArray: any;

  constructor(public navCtrl: NavController, public mediaProvider: MediaProvider) {
    this.tabBarElement = document.querySelector('.tabbar');
  }
  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement.style.display = 'flex';
    }, 4000);
    console.log("ViewDidLoad");
    this.loadmedia();
  }

  doRefresh(refresher) {

    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      this.loadmedia();
      refresher.complete();
    }, 1500);
  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }


  loadmedia() {
    this.mediaProvider.getMedia().subscribe(data => {
      console.log(data);
      this.mediaArray = data;

      this.mediaArray.map(media => {
        const temp = media.filename.split('.');
        const thumbName = temp[0] + '-tn320.png';
        media.thumbnail = thumbName;
      });

      console.log(data);
      console.log(this.mediaArray);
    });

  }

}
