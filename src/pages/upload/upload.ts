import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpErrorResponse} from "@angular/common/http";
import {MediaProvider} from "../../providers/media/media";
import {Media} from "../../app/Interfaces/media";
import {HomePage} from "../home/home";

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})


export class UploadPage {

  file: File;
  media: Media = {
    title: '',
    description: ''
  };

  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController,) {
  }

  setFile(evt) {
    console.log(evt.target.files[0]);
    this.file = evt.target.files[0];
  }

  getFile(){
    document.getElementById("upfile").click();
  }


  startUpload() {
    this.loading.present();

    const formData = new FormData();
    // create FormData-object
    // add title and description to FormData object
    formData.append('title', this.media.title);
    formData.append('description', this.media.description);
    // add file to FormData object
    formData.append('file', this.file);
    // send FormData object to API
    console.log('before' + formData);

    this.mediaProvider.upload(formData, localStorage.getItem('token')).subscribe(data => {
      console.log(data);
      const fileId = data['file_id'];
      const tag = {
        file_id: fileId,
      };

      this.mediaProvider.postTag(tag, localStorage.getItem('token')).
      subscribe(response => {
        setTimeout(() => {
          this.loading.dismiss();
          this.navCtrl.setRoot(HomePage);
        }, 2000);
      }, (tagError: HttpErrorResponse) => {
        console.log(tagError);
        this.loading.dismiss();
      });
      console.log('after' + formData);

    }, (e: HttpErrorResponse) => {
      this.loading.dismiss();
      console.log(e);
    });
  }

}
