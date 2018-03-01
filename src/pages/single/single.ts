import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {HttpErrorResponse} from '@angular/common/http';
import {MediaProvider} from "../../providers/media/media";
import {PhotoViewer} from "@ionic-native/photo-viewer";

/**
 * Generated class for the SinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-single',
  templateUrl: 'single.html',
})
export class SinglePage {

  url: string;
  title: string;
  description: string;
  tags = '';

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private photoViewer: PhotoViewer) {
  }

  showImage() {
    this.photoViewer.show(this.url, this.title, {share: false});
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SinglePage');
    console.log(this.navParams.get('mediaID'));
    this.mediaProvider.getSingleMedia(this.navParams.get('mediaID')).
    subscribe(response => {
      console.log(response);
      this.url = this.mediaProvider.mediaURL + response['filename'];
      this.title = response['title'];
      this.description = response ['description'];

      this.mediaProvider.getTagByFile(response['file_id']).

      subscribe(response => {
        console.log(response);

        if (response.length === 0) this.tags = 'No tags';

        response.forEach(t => {
          //const tag = JSON.parse(t['tag']);
          console.log(t['tag']);
          this.tags = t['tag'];
        });

      });
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

}
