import { Injectable } from '@angular/core';
import {HostService} from "./host.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {User} from "../model/User";
import {TicketModel} from "../model/TicketModel";

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

  isAuthenticated(): boolean{
    return !!localStorage.getItem('TOKEN')
  }
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
  getSeatMatrixOfShow(showId: string): Observable<any>{
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient.get(`${this.REST_API_URL}${this.USER_PREFIX}/shows/seating?showId=${showId}`, OPTIONS);

  }


  bookMovieTicket(showId: string, seatIds: string[], amount: number): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient
      .post(`${this.REST_API_URL}${this.USER_PREFIX}/booking/${showId}`, seatIds, {
        headers: headers,
        params: { amount: amount },
        observe: 'response' as 'body'
      });
  }

  bookEntryPass(showId: string, category: string, quantity: number, amount: number): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient
      .post(`${this.REST_API_URL}${this.USER_PREFIX}/booking/pass/${showId}`, null, {
        headers: headers,
        params: { category, quantity: quantity, amount: amount },
        observe: 'response' as 'body'
      });
  }

  search(query: string, location: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient
      .get(`${this.REST_API_URL}${this.USER_PREFIX}/search?query=${query}&location=${location}`, OPTIONS);
  }

  cancelPass(ticket: TicketModel){
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient
      .post(`${this.REST_API_URL}${this.USER_PREFIX}/pass/cancel`,ticket, OPTIONS);
  }

  cancelMovieTicket(showId: string, ticketId: string, showSeatId: string[]): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient
      .post(`${this.REST_API_URL}${this.USER_PREFIX}/booking/cancel/${showId}/${ticketId}`, showSeatId, {
        headers: headers,
        observe: 'response' as 'body'
      });
  }
}
