import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpErrorResponse} from "@angular/common/http";
import {MediaProvider} from "../../providers/media/media";
import {Media} from "../../app/Interfaces/media";
import {EXIF} from 'exif-js';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
 } from '@ionic-native/google-maps';

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



  ionViewDidLoad() {
    this.form = <HTMLFormElement>document.getElementById('uploadForm'); // we need to cast it like this: https://stackoverflow.com/questions/29983341/typescript-form-reset-not-working
  }

  form;
  file: File;
  media: Media = {
    title: '',
    description: ''
  };

  newTag;
  tags = [];

  fileId;

  // image position preview variables
  map: GoogleMap;
  lat;
  lon;
  locationFound = false;

  loader; // our "uploading"- screen variable

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider, private loadingCtrl: LoadingController) {
  }

  setFile(evt) {
    this.file = evt.target.files[0];
    console.log(this.file);
    console.log(evt.target);
    this.getExif(this.file);
  }

  // this method retrieves latitude and longitude values from image
  getExif(img) {
    try {
      EXIF.getData(img, () => {
        console.log(EXIF.getAllTags(img));
        if (EXIF.getTag(img, 'GPSLatitude')) {
          this.lat = this.degreesToDecimals(EXIF.getTag(img, 'GPSLatitude'));
          this.lon = this.degreesToDecimals(EXIF.getTag(img, 'GPSLongitude'));

          console.log(this.lat);
          console.log(this.lon);
          this.showPosition(this.lat, this.lon);
        } else {
          alert('No GPS data found from image');
        }
      });
    } catch (e) {
      console.log(e);
    }
  }


  // this method converts EXIF location data to decimal values that we can use in google maps
  degreesToDecimals(deg: Array<number>): number {
    return deg[0]['numerator'] + deg[1]['numerator'] /
           (60 * deg[1]['denominator']) + deg[2]['numerator'] / (3600 * deg[2]['denominator']);
  }

  //
  showPosition(latitude, longitude) {
    this.locationFound = true; // show the map in DOM
    const map_div = document.getElementById('upload_map');
    //console.log('maps');
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: latitude,
          lng: longitude
        },
        zoom: 15,
        tilt: 0
      }
    };

    if(map_div.firstChild) {
      this.map.destroy()
      this.map = GoogleMaps.create(map_div, mapOptions);
      this.mediaProvider.setMapBackgroundColor();
    } else {
      this.map = GoogleMaps.create(map_div, mapOptions);
      this.mediaProvider.setMapBackgroundColor();
    }
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        // Now you can use all methods safely.
        this.map.addMarker({
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: latitude,
              lng: longitude
            }
          });
      });


  }

  getFile(){
    document.getElementById("upfile").click();
  }

  upload() {

    const formData = new FormData();

    // add title and description to FormData object
    formData.append('title', this.media.title);

    // add latitude and longitude before real description
    formData.append('description', this.lat + '|' + this.lon + '|' + this.media.description);

    // add file to FormData object
    formData.append('file', this.file);
    // send FormData object to API
    //console.log('before' + formData);

    this.mediaProvider.upload(formData, localStorage.getItem('token')).subscribe(data => {
      //console.log(data);
      this.fileId = data['file_id'];

      // here we put our default tag 'geopic' that is in all of our apps pictures
      this.defaultTag();

      for (var i = 0; i < this.tags.length; i++) {

        let tag = {
          file_id: this.fileId,
          tag: this.tags[i]
        };

        this.mediaProvider.postTag(tag, localStorage.getItem('token')).subscribe(response => {
          setTimeout(() => {
            //just in case, have some timeout
          }, 500);
        }, (tagError: HttpErrorResponse) => {
          console.log(tagError);
          this.loader.dismiss();
        });
      }

      this.tags = [];

      this.loader.dismiss();
      //this.navCtrl.parent.select(0); // navigate to homepage

      //console.log('after' + formData);

      if(document.getElementById('upload_map').firstChild) {
        this.map.destroy(); // destroy map after succesfull upload
      }

      this.locationFound = false; // close the google map preview
      this.form.reset(); // reset form for next upload

      alert('Picture uploaded succesfully!');

    }, (e: HttpErrorResponse) => {
      this.loader.dismiss();
      console.log(e);
    });
  }

  addTag() {
    this.tags.push(this.newTag);
    this.newTag = '';
  }

  removeTag(index) {
    this.tags.splice(index, 1);
  }

  startUpload() {
    this.loader = this.loadingCtrl.create({
      content: 'Uploading, please wait...',
    });

    this.loader.present().then(() => {
      this.upload();
    });
  }

  defaultTag() {
    const geopicTag = {
      file_id: this.fileId,
      tag: "geopic"
    }

    this.mediaProvider.postTag(geopicTag, localStorage.getItem('token')).subscribe();
    //console.log('added tag: geopic');
  }

}
