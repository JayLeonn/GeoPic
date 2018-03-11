import {Component} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpErrorResponse} from '@angular/common/http';
import {MediaProvider} from "../../providers/media/media";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {Comment} from "../../app/Interfaces/comment";
import {HomePage} from "../home/home";
import {debugOutputAstAsTypeScript} from "@angular/compiler";
import {update} from "ionic-angular/umd/components/slides/swiper/swiper";
import set = Reflect.set;

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
  userId: number;
  fileId: number;
  username: string;
  tags = '';
  commentArray: any;
  commentguy: any;
  comment: string;
  mediaID = this.navParams.get('mediaID');
  currentUserName: string;

  commentsLoaded: boolean;

  likeCount = 0;

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
    this.getMedia();
    this.currentUser();

  }

  getMedia(){
    this.commentsLoaded = false;

    this.mediaProvider.getSingleMedia(this.mediaID).
    subscribe(response => {
      //console.log(response);
      this.url = this.mediaProvider.mediaURL + response['filename'];
      this.title = response['title'];
      this.description = response ['description'];
      this.userId = response ['user_id'];
      this.fileId = response['file_id']


      this.mediaProvider.getUserNameById(this.userId, localStorage.getItem('token'))
        .subscribe( result => {
          this.username = result['username'];

          this.mediaProvider.getTagByFile(this.fileId).
          subscribe(response => {
            //console.log(response);

            this.loadcomments();

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

        });

  }


  loadcomments() {

      this.mediaProvider.getCommentsByFile(this.mediaID).subscribe(data => {
        console.log(data);
        this.commentArray = data;

        this.commentArray['user_id'];

        if (this.commentArray.length != 0){

        this.commentArray.map(com => {

          this.mediaProvider.getUserNameById(com.user_id, localStorage.getItem('token')).subscribe(response => {

            com.user = response;

            console.log(com.user['username']);

            this.countFavourites();


          });
          });
        } else {
          this.countFavourites();
        }
      });
  }

  pushComment(){

    this.commentData.file_id = this.mediaID;

    this.mediaProvider.postComment(this.commentData, localStorage.getItem('token'))
      .subscribe(response => {
        console.log(response);
        console.log(this.commentData);
        this.getMedia();
      });

    }

  currentUser() {

    this.mediaProvider.getCurrentUser(localStorage.getItem('token'))
      .subscribe(user => {

        this.currentUserName = user['username'];

        }, (getUserError: HttpErrorResponse) => {
        console.log(getUserError);
      }
    )
  }

  addToFavourites (id) {

    const file_id = {
      file_id: id
    };

    console.log(file_id);

    this.mediaProvider.favouriteThis(file_id, localStorage.getItem('token'))
      .subscribe( favourite => {
        console.log(favourite);
        this.getMedia();
      },(error: HttpErrorResponse) => {
        console.log(error);
      });

  }

  countFavourites () {
    this.mediaProvider.getLikes(this.mediaID)
      .subscribe( favouriteCount => {

        this.likeCount = Object.keys(favouriteCount).length;

        this.commentsLoaded = true;
        console.log('likes ' + this.likeCount);

        });
  }

}
