import {HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {Observable, throwError, catchError, switchMap, map} from 'rxjs';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const refreshTokenFn = (http: HttpClient): Observable<any> => {
  const refreshToken = localStorage.getItem('REFRESH_TOKEN');
  const refreshUrl = `${environment.BIOSCOPE_USERS}/v01/auth/refresh`;
  return http.post(refreshUrl, null, {
    params: { refreshToken: refreshToken || '' },
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    map((response: any) => {
      const newToken = response.token || response.data?.token;
      const newRefreshToken = response.refreshToken || response.data?.refreshToken;
      localStorage.setItem('TOKEN', newToken);
      localStorage.setItem('REFRESH_TOKEN', newRefreshToken);
      return newToken;
    })
  );
};

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  console.log('AuthInterceptor triggered for:', req.url);
  const http = inject(HttpClient);
  const token = localStorage.getItem('TOKEN');
  const baseUrl = environment.BIOSCOPE_USERS;
  const endpoint = req.url.replace(baseUrl, '');

  const unprotectedUrls: Map<string, string> = new Map([
    ['/v01/auth/login', 'POST'],
    ['/v01/auth/register', 'POST'],
    ['/v01/auth/refresh', 'POST'],
    ['/v01/user/shows', 'GET'],
    ['/v01/user/hosts', 'GET'],
    ['/v01/user/trending-shows', 'GET'],
    ['/v01/user/trending-movies', 'GET'],
    ['/v01/user/streaming/movies', 'GET'],
    ['/v01/user/search', 'GET'],
    ['/v01/user/shows/seating', 'GET'],
    ['/v01/user/movie', 'GET'],
    ['https://countriesnow.space/api/v0.1/countries/cities', 'POST']
  ]);

  const isUnprotected = unprotectedUrls.has(endpoint) && unprotectedUrls.get(endpoint) === req.method;

  if (!isUnprotected && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Token added:', token);

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('401 detected, attempting token refresh');
          return refreshTokenFn(http).pipe(
            switchMap(newToken => {
              console.log('New token obtained:', newToken);
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(retryReq);
            }),
            catchError(refreshError => {
              console.log('Refresh failed:', refreshError);

              localStorage.removeItem('TOKEN');
              localStorage.removeItem('REFRESH_TOKEN');
              // Optionally redirect: inject(Router).navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
