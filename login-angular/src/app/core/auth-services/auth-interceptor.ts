import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

/**
 * Auth interceptor.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructor.
   * @param {AuthService} authService - authorisation services provider.
   */
  constructor(private authService: AuthService) {}

  /**
   * Inceptor for http requests, handle 401 status.
   * @param {HttpRequest<any>} req - request.
   * @param {HttpHandler} next - next handler.
   * @return {Observable<HttpEvent<any>>} event.
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next
      .handle(req).pipe(
        catchError(err => {
          // reset auth service if user fails authorisation at any time
          if (401 === err.status) {
            this.authService.setToken();
          }

          return throwError('Request failed');
        })
      );
  }
}
