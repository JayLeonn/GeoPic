import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpErrorResponse} from '@angular/common/http';
import {MediaProvider} from "../../providers/media/media";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {Comment} from "../../app/Interfaces/comment";
import {HomePage} from "../home/home";
import {debugOutputAstAsTypeScript} from "@angular/compiler";
import {update} from "ionic-angular/umd/components/slides/swiper/swiper";

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

  commentData: Comment = {
    file_id: '',
    comment: ''
  };

  url: string;
  title: string;
  description: string;
  tags = '';
  commentArray: any;
  commentguy: any;
  comment: string;
  mediaID = this.navParams.get('mediaID');
  currentMediaId: string;
  currentUserName: string;

  commentsLoaded: boolean;

  i = 0;
  y = 0;

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
    console.log(this.commentsLoaded + '1');
    console.log('ionViewDidLoad SinglePage');
    console.log(this.mediaID);
    this.loadcomments();
    this.currentUser();
  }

  getMedia(){
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
        this.commentsLoaded = true;

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

      this.mediaProvider.getCommentsByFile(this.mediaID).subscribe(data => {
        console.log(data);
        this.commentArray = data;

        console.log('before '+this.i);
        console.log(this.commentArray);

        this.commentArray.map(com => {

          this.mediaProvider.getUserNameById(com.user_id, localStorage.getItem('token')).subscribe(response => {

            com.user = response;

            this.getMedia();

          });

        });
      });
      this.i++;
      console.log('after '+this.i)
  }

  pushComment(){

    this.commentData.file_id = this.mediaID;

    this.mediaProvider.postComment(this.commentData, localStorage.getItem('token'))
      .subscribe(response => {
        console.log(response);
        console.log(this.commentData);
      });
    this.loadcomments();
    }

  currentUser() {

    this.mediaProvider.getCurrentUser(localStorage.getItem('token'))
      .subscribe(user => {

        this.currentUserName = user['username'];

        console.log(this.currentMediaId);
        }, (getUserError: HttpErrorResponse) => {
        console.log(getUserError);
      }
    )
  }

}
