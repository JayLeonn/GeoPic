import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpErrorResponse} from '@angular/common/http';
import {MediaProvider} from "../../providers/media/media";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {Media} from "../../app/Interfaces/media";
import {HomePage} from "../home/home";

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
  comments: any;
  commentArray: any;
  commentguy: any;
  comment: string;
  mediaID = this.navParams.get('mediaID');

  userInfo: any = '';

  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private photoViewer: PhotoViewer,
    private loadingCtrl: LoadingController) {
  }

  showImage() {
    this.photoViewer.show(this.url, this.title, {share: false});
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SinglePage');
    console.log(this.mediaID);
    this.loadcomments();
    this.mediaProvider.getSingleMedia(this.mediaID).
    subscribe(response => {
      console.log(response);
      this.url = this.mediaProvider.mediaURL + response['filename'];
      this.title = response['title'];
      this.description = response ['description'];

      console.log(response['file_id']);

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


  loadcomments() {

    const commentSection = document.getElementById('commentSection');
      this.mediaProvider.getCommentsByFile(this.mediaID).subscribe(data => {
        console.log(data);
        this.commentArray = data;

        this.commentArray.map(com => {

          this.mediaProvider.getUserNameById(com.user_id, localStorage.getItem('token')).subscribe(response => {

            console.log('geted username');
            com.user = response;
            // console.log(com['user'].username + ': ' + com['comment']);
            this.commentguy = com['user'].username + ': ' + com['comment'];
            const commentElement = `<li>` + this.commentguy + `</li>`;

            commentSection.innerHTML += commentElement;
          });

        });
      });
  }

  pushComment(){
    this.loading.present();

    const comment = new FormData();

    comment.append('comment', this.comment);

    console.log('before' + comment);

    this.mediaProvider.postComment(comment, this.mediaID, localStorage.getItem('token'))
      .subscribe(data =>{
        console.log(data);
        this.loading.dismiss();
      }, (commentError: HttpErrorResponse) => {
        console.log(commentError);
        this.loading.dismiss();
      });
    console.log('after' + comment);
  }

}
