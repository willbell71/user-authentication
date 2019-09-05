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
  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }

  /**
   * Logout user.
   * @return {Observable<boolean>} return observable with registration status.
   */
  public logout(): Observable<boolean> {
    const observable: Observable<boolean> = new Observable<boolean>(observer => {
      this.httpClient.post<{}>(`${environment.apiBaseURL}/logout`, {}, {
        headers: new HttpHeaders({
          authorization: `Bearer ${this.authService.getToken()}`
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
