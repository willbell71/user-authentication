import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth-services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Logout service.
 */
@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  /**
   * Constructor.
   */
  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  /**
   * Logout a user.
   * @param {string} token - users token.
   * @return {Observable<boolean>} return observable with registration status.
   */
  public logout(token: string): Observable<boolean> {
    const observable: Observable<boolean> = new Observable<boolean>(observer => {
      this.httpClient.get(`${environment.apiBaseURL}/logout`, {
        headers: new HttpHeaders({
          authorization: `Bearer ${token}`
        })
      }).subscribe(() => {
        // handle success
        this.authService.setToken();
        observer.next(true);
        observer.complete();
      }, () => {
        // handle error
        observer.next(false);
        observer.complete();
      });
    });

    return observable;
  }
}
