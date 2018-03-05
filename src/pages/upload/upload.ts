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
  Marker
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

  file: File;
  media: Media = {
    title: '',
    description: ''
  };

  // image position preview variables
  map: GoogleMap;
  lat;
  lon;
  locationFound = false;

  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider, private loadingCtrl: LoadingController) {
  }

  setFile(evt) {
    this.file = evt.target.files[0];
    this.getExif(this.file);
  }

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
          console.log('No GPS data found from image');
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  degreesToDecimals(deg: Array<number>): number {
    
    return deg[0]['numerator'] + deg[1]['numerator'] /
           (60 * deg[1]['denominator']) + deg[2]['numerator'] / (3600 * deg[2]['denominator']);
  }

  showPosition(latitude, longitude) {
    this.locationFound = true; // show the map in DOM
    const map_div = document.getElementById('upload_map');
    console.log('maps');
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

    this.map = GoogleMaps.create(map_div, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: latitude,
              lng: longitude
            }
          })
      });
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
    //console.log('before' + formData);

    this.mediaProvider.upload(formData, localStorage.getItem('token')).subscribe(data => {
      console.log(data);
      const fileId = data['file_id'];
      const tag = {
        file_id: fileId,
      };

      this.mediaProvider.postTag(tag, localStorage.getItem('token')).subscribe(response => {
        setTimeout(() => {
          this.loading.dismiss();
          this.navCtrl.parent.select(0); // navigate to homepage
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
