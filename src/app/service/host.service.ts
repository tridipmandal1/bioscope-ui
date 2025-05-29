import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/User";
import {AuthRequest} from "../model/AuthRequest";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";
import {ProfileRequest} from "../model/ProfileRequest";

@Injectable({
  providedIn: 'root'
})
export class HostService {

  private readonly REST_API_URL = environment.BIOSCOPE_USERS;
  private readonly AUTH_PREFIX: string = '/v01/auth';

  private currentLoggedUser: User = new User();
  public isAuthenticated(): boolean {
    return !!localStorage.getItem('TOKEN');
  }
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    ) { }

  registerHost(host: AuthRequest): Observable<any>{
    return this.httpClient.post(`${this.REST_API_URL}${this.AUTH_PREFIX}/register`, host);
  }

  getCurrentLoggedUser(): User {
    this.getHostProfile().subscribe({
      next: (response) => {
        this.currentLoggedUser.email = response.body.email;
        this.currentLoggedUser.name = response.body.name;
        this.currentLoggedUser.location = response.body.location;
        this.currentLoggedUser.userId = response.body.userId;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    })
    return this.currentLoggedUser;
  }
  getHostProfile(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    const role = localStorage.getItem('ROLE');
    if(role === 'HOST') {
      return this.httpClient.get(`${this.REST_API_URL}/v01/host`, OPTIONS).pipe(
        map((response: any) => {
          this.currentLoggedUser.email = response.body.email;
          this.currentLoggedUser.name = response.body.name;
          this.currentLoggedUser.location = response.body.location;
          this.currentLoggedUser.userId = response.body.userId;
          return response;
        })
      );
    } else {
      return this.httpClient.get(`${this.REST_API_URL}/v01/user`, OPTIONS).pipe(
        map((response: any) => {
          this.currentLoggedUser.email = response.body.email;
          this.currentLoggedUser.name = response.body.name;
          this.currentLoggedUser.location = response.body.location;
          this.currentLoggedUser.userId = response.body.userId;
          return response;
        })
      );
    }

  }
  isProfileCreated(): boolean {
    this.getHostProfile().subscribe();
    return !!(this.currentLoggedUser.name && this.currentLoggedUser.location);
  }
  login(host: AuthRequest): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };

    return this.httpClient.post(`${this.REST_API_URL}${this.AUTH_PREFIX}/login`, host, OPTIONS).pipe(
      map((response: any) => {
        this.currentLoggedUser.email = response.body.email;
          localStorage.setItem('TOKEN', response.body.token);
          localStorage.setItem('REFRESH_TOKEN', response.body.refreshToken);
        return response;
      })
    )
  }
  private clearToken() {
      localStorage.removeItem('TOKEN');
      localStorage.removeItem('REFRESH_TOKEN');
  }

  getToken(): any {
      return localStorage.getItem('TOKEN');
  }
   hasToken(): boolean {
      return !!localStorage.getItem('TOKEN');
  }

  refreshToken(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    const token = localStorage.getItem('REFRESH_TOKEN');
    return this.httpClient.post(`${this.REST_API_URL}${this.AUTH_PREFIX}/refresh?refreshToken=${token}`, OPTIONS).pipe(
      map((response: any) => {
          localStorage.setItem('TOKEN', response.data.token);
          localStorage.setItem('REFRESH_TOKEN', response.data.refreshToken);
        return response;
      })
    );
  }
  logout(): void {
    this.clearToken();
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    const token = `Bearer ${localStorage.getItem('TOKEN')}`;
    headers.append('Authorization', token);
    return this
      .httpClient
      .post(`${this.REST_API_URL}${this.AUTH_PREFIX}/changePassword?oldPassword=${oldPassword}&newPassword=${newPassword}`, OPTIONS);
  }

  updateProfile(profile: ProfileRequest): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const OPTIONS = { headers: headers, observe: 'response' as 'body' };
    return this.httpClient.post(`${this.REST_API_URL}${this.AUTH_PREFIX}/update`, profile, OPTIONS);
  }
}
