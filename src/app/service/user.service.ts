import { Injectable } from '@angular/core';
import {HostService} from "./host.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  private readonly REST_API_URL = environment.BIOSCOPE_USERS;
  private readonly USER_PREFIX: string = '/v01/user';

  currentLoggedUser: User = new User();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {}


  getTrendingMovies(): Observable<any>{
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient.get(`${this.REST_API_URL}${this.USER_PREFIX}/trending-movies`, OPTIONS);
  }

  getTrendingShows(location: string): Observable<any>{
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient.get(`${this.REST_API_URL}${this.USER_PREFIX}/trending-shows?location=${location}`,
      OPTIONS);
  }

  getMovie(movieId: string): Observable<any>{
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient.get(`${this.REST_API_URL}${this.USER_PREFIX}/movie/${movieId}`, OPTIONS);
  }

  getHostsByMovieNameAndLocation(movieName: string, location: string): Observable<any>{
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient
      .get(`${this.REST_API_URL}${this.USER_PREFIX}/hosts?location=${location}&movieName=${movieName}`, OPTIONS);
  }
  getShow(showId: string): Observable<any>{
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient.get(`${this.REST_API_URL}${this.USER_PREFIX}/show/${showId}`, OPTIONS);
  }
  getCities(): Observable<any> {
    return this.httpClient.post('https://countriesnow.space/api/v0.1/countries/cities',
      {country: 'India'} )
  }
}
