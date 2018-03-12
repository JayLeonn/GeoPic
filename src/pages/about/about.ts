import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SinglePage} from "../single/single";
import {MediaProvider} from "../../providers/media/media";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  tag = this.navParams.get('tag');
  mediaArray: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider) {
  }
  ionViewDidLoad() {
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
    this.mediaProvider.getPostsByTag(this.tag).subscribe(data => {
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
