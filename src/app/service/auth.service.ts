import { Injectable } from '@angular/core';
import {HostService} from "./host.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HostService{

  constructor(private http: HttpClient, private routeR: Router) {
    super(http, routeR);
  }

  getUserProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.http.get(`${environment.BIOSCOPE_USERS}/v01/user`, OPTIONS);
  }
}
