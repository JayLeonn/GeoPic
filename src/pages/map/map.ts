import { CoordinatesPipe } from './../../pipes/coordinates/coordinates';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider, private coordinatePipe: CoordinatesPipe) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  ionViewWillEnter() {
    this.map.addMarker(null);
    this.putMarkers();
  }

  putMarkers() {
    this.mediaProvider.getPostsByTag('geopic').subscribe(data => {
      //console.log(data);
      this.posts = data;
      
      for(var i = 0; i < this.posts.length; i++) {
        //this.getLatLon(this.posts[i].file_id);

        let mapMarker: MarkerOptions = {
          title: this.posts[i].title,
          icon: 'blue',
          map: this.map,
          position:  {
            lat: this.coordinatePipe.transform(this.posts[i].description, 'lat'),
            lng: this.coordinatePipe.transform(this.posts[i].description, 'lng')
          }
        };

        console.log(mapMarker);

        this.map.addMarker(mapMarker);
      }

    });
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
