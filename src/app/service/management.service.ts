import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ScreenRequest} from "../model/ScreenRequest";
import {Observable} from "rxjs";
import {Screen} from "../model/Screen";
import {RowDataModel} from "../model/RowDataModel";
import {ShowModel} from "../model/ShowModel";
import {Movie} from "../model/Movie";

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  private readonly REST_API_URL = environment.BIOSCOPE_USERS;
  private readonly HOST_PREFIX: string = '/v01/host';
  constructor(private httpClient: HttpClient) { }


  createScreen(screen: ScreenRequest): Observable<any> {
    return this.httpClient.post(`${this.REST_API_URL}${this.HOST_PREFIX}/create-screen`, screen);
  }

  getScreenById(id: string): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/get-screen/${id}`);
  }

  updateScreenName(id: string, newName: string): Observable<any> {
    return this.httpClient.put(`${this.REST_API_URL}${this.HOST_PREFIX}/update-screen/${id}?newName=`,null);
  }

  getSeatingArrangementById(arrangementId: string): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/seating/${arrangementId}`);
  }

  updateSeatingArrangement(arrangementId: string, screen: ScreenRequest): Observable<any> {
    return this.httpClient
      .put(`${this.REST_API_URL}${this.HOST_PREFIX}/update-seating-arrangement/${arrangementId}`, screen);
  }

  updateSeatingByOneRow(arrangementId: string, rowData: RowDataModel): Observable<any> {
    return this.httpClient
      .put(`${this.REST_API_URL}${this.HOST_PREFIX}/update-seating-row/${arrangementId}`, rowData);
  }

  getAllScreens(): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/screens`);
  }

  deleteScreen(screenId: string): Observable<any> {
    return this.httpClient.delete(`${this.REST_API_URL}${this.HOST_PREFIX}/delete-screen/${screenId}`);
  }

  createShow(screenId: string, show: ShowModel): Observable<any> {
    return this.httpClient.post(`${this.REST_API_URL}${this.HOST_PREFIX}/create/show?screenId=${screenId}`, show);
  }

  createOpenShow(show: ShowModel): Observable<any> {
    return this.httpClient.post(`${this.REST_API_URL}${this.HOST_PREFIX}/create/open-show`, show);
  }

  updateShow(showId: string, show: ShowModel): Observable<any> {
    return this.httpClient.put(`${this.REST_API_URL}${this.HOST_PREFIX}/show/${showId}`, show);
  }

  updateOpenShow(showId: string, show: ShowModel): Observable<any> {
    return this.httpClient.put(`${this.REST_API_URL}${this.HOST_PREFIX}/update/open-show/${showId}`, show);
  }

  getAllShows(): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/shows`);
  }

  getShowById(showId: string): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/show/${showId}`);
  }

  deleteShow(showId: string): Observable<any> {
    return this.httpClient.delete(`${this.REST_API_URL}${this.HOST_PREFIX}/show/${showId}`);
  }

  createMovie(movie: Movie): Observable<any> {
    return this.httpClient.post(`${this.REST_API_URL}${this.HOST_PREFIX}/movie`, movie);
  }

  updateMovie(movieId: string, movie: Movie): Observable<any> {
    return this.httpClient.put(`${this.REST_API_URL}${this.HOST_PREFIX}/movie/${movieId}`, movie);
  }

  getMovies(): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/movies`);
  }

  getMovieById(movieId: string): Observable<any> {
    return this.httpClient.get(`${this.REST_API_URL}${this.HOST_PREFIX}/movie/${movieId}`);
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.httpClient.delete(`${this.REST_API_URL}${this.HOST_PREFIX}/movie/${movieId}`);
  }

  verifyTicket(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.REST_API_URL}${this.HOST_PREFIX}/verify-ticket`, formData);
  }

  verifyPass(file: File): Observable<any> {
    const headers = new HttpHeaders({Accept: 'application/json'});
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`${this.REST_API_URL}${this.HOST_PREFIX}/verify-pass`, formData);
  }
}
