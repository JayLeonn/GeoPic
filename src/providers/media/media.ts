import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {NavController} from "ionic-angular";
import {User} from "../../app/Interfaces/user";

/*
  Generated class for the MediaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaProvider {

  apiUrl = 'http://media.mw.metropolia.fi/wbma';
  mediaURL = 'http://media.mw.metropolia.fi/wbma/uploads/';

  constructor(public http: HttpClient) {
  }

  public login(user: User) {

    const settings = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(this.apiUrl+ '/login', user, settings);
  }

  public register(user: User) {
    return this.http.post(this.apiUrl + '/users', user);
  }

  public getMedia() {
    return this.http.get(this.apiUrl + '/media')
  }

  getSingleMedia(id) {
    return this.http.get<Array<string>>(this.apiUrl + '/media/' + id);
  }

  getTagByFile(id) {
    return this.http.get<Array<object>>(this.apiUrl + '/tags/file/' + id);
  }

  postTag(tag, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };
    return this.http.post(this.apiUrl + '/tags', tag, settings);
  }

  upload(formData, token) {
    const settings = {
      headers: new HttpHeaders().set('x-access-token', token),
    };
    return this.http.post(this.apiUrl + '/media', formData, settings);
  }

}
