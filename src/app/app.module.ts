import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MediaProvider } from '../providers/media/media';
import {MapPage} from "../pages/map/map";
import {UploadPage} from "../pages/upload/upload";
import {ProfilePage} from "../pages/profile/profile";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import { GoogleMaps } from '@ionic-native/google-maps';
import {SinglePage} from "../pages/single/single";
import {PipesModule} from "../pipes/pipes.module";
import {PhotoViewer} from "@ionic-native/photo-viewer";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapPage,
    ProfilePage,
    UploadPage,
    SinglePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MapPage,
    ProfilePage,
    UploadPage,
    SinglePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MediaProvider,
    GoogleMaps,
    PhotoViewer
  ]
})
export class AppModule {}
