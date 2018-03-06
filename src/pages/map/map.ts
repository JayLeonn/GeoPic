import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';

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
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: GoogleMap;
  posts: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  putMarkers() {
    this.mediaProvider.getPostsByTag('geopic').subscribe(data => {
      //console.log(data);
      this.posts = data;

      for(var i = 0; i < this.posts.length; i++) {
        let mapMarker = {
          title: this.posts[i].title,
          icon: 'blue',
          position: {
            lat: this.getLatitude(this.posts[i].file_id),
            lng: this.getLongitude(this.posts[i].file_id)
          }
        };
        this.map.addMarker(mapMarker);
      }

    });
  }

  getLatitude(file_id) {
    var returnable = [];
    this.mediaProvider.getTagByFile(file_id).subscribe(data => {
      // the second index tag is by default our picture coordinates 
      var tmp = data[1]['tag'];
      //console.log(tmp);
      returnable = tmp.split('|');
      //console.log(returnable);
    });
    
    return returnable[0]; // return the first part of split (latitude)
  }

  getLongitude(file_id) {
    var returnable = [];
    this.mediaProvider.getTagByFile(file_id).subscribe(data => {
      // the second index tag is by default our picture coordinates 
      var tmp = data[1]['tag'];
      returnable = tmp.split('|');
    });
    
    return returnable[1]; // return the second part of split (longitude)
  }

  loadMap() {
    const map_div = document.getElementById('map_canvas');
    //console.log('maps');
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 60.221070,
          lng: 24.805116
        },
        zoom: 8,
        tilt: 0
      }
    };

    this.map = GoogleMaps.create(map_div, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {

        this.putMarkers();
        //console.log('Map is ready!');

        // Now you can use all methods safely.
        /*
        this.map.addMarker({
            title: 'Ionic',
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: 43.0741904,
              lng: -89.3809802
            }
          })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });
          */
      });
  }

}
