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
import {CoordinatesPipe} from "../../pipes/coordinates/coordinates";
import {AboutPage} from "../about/about";

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
  myId: number;
  fileId: number;
  username: string;
  tags: any;
  commentArray: any;
  commentguy: any;
  comment: string;
  mediaID = this.navParams.get('mediaID');
  currentUserName: string;
  likeInfo = '';
  liked: boolean;

  commentsLoaded: boolean;

  likeCount = 0;

  userInfo: any = '';

  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private photoViewer: PhotoViewer,
    private loadingCtrl: LoadingController,
    private pipe: CoordinatesPipe) {
  }

  showImage() {
    this.photoViewer.show(this.url, this.title, {share: true});
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
    this.liked = false;

    this.mediaProvider.getSingleMedia(this.mediaID).
    subscribe(response => {
      console.log(response);
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
            console.log(response[0]);

            if (response.length === 0) {
              this.tags = 'No tags';
            } else {
              this.tags = response;
              for (let i = 0; i < this.tags.length; i++){
                if (this.tags[i].tag === 'geopic') {
                  this.tags.splice(i, 1);
                }

              }
              console.log(this.tags);
            }

            /*response.forEach(t => {
              //const tag = JSON.parse(t['tag']);
              console.log(t['tag']);
              this.tags = t['tag'];
            }); */
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
        document.getElementById('comment').innerText = '';
        this.getMedia();
      });

    }

  currentUser() {

    this.mediaProvider.getCurrentUser(localStorage.getItem('token'))
      .subscribe(user => {

        this.currentUserName = user['username'];
        this.myId = user['user_id'];

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


    if (this.liked){
      this.mediaProvider.deleteFavourite(this.mediaID, localStorage.getItem('token'))
        .subscribe( data => {
          this.countFavourites();
          this.liked = false;
          console.log(data);
        }, (error: HttpErrorResponse) => {
          this.countFavourites();
          console.log(error);
          });
    } else {
    this.mediaProvider.favouriteThis(file_id, localStorage.getItem('token'))
      .subscribe( favourite => {
        this.countFavourites();
        this.liked = true;
        console.log(favourite);
      },(error: HttpErrorResponse) => {
        this.countFavourites();
        console.log(error);
      });
    }
  }

  countFavourites () {
    this.mediaProvider.getLikes(this.mediaID)
      .subscribe( favouriteCount => {

        this.likeCount = Object.keys(favouriteCount).length;

        if(this.likeCount === 0) {
          this.likeInfo = ' , you don´t like this';
          this.liked = false;
        }

        console.log(favouriteCount);
        console.log(this.userId);
        this.commentsLoaded = true;
        console.log('likes ' + this.likeCount);

        // gets array of likes and checks if current user is among them
          for (let i = 0; i < this.likeCount; i++){
            if (favouriteCount[i].user_id === this.myId) {
              this.likeInfo = ' , you like this';
              this.liked = true;
            } else {
              this.likeInfo = ' , you don´t like this';
              this.liked = false;
            }
        }
        });
  }

  openByTag(tag) {
    this.navCtrl.push(AboutPage, {
      tag: tag,
    });
  }

}
