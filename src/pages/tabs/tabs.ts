import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ProfilePage } from "../profile/profile";
import { UploadPage } from "../upload/upload";
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = UploadPage;
  tab3Root = ProfilePage;
  //tab4Root = HomePage;
  constructor() {

  }
}
