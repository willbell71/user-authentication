import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { LoginResponse } from './login-response';

/**
 * Login service.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /**
   * Constructor.
   * @param {httpClient} httpClient - http provider.
   * @param {AuthService} authService - authentication services provider.
   */
  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  /**
   * Login user with given credentials.
   * @param {string} email - users email address.
   * @param {string} password - users password.
   * @return {Observable<boolean>} observable that passes the result of the log in process.
   */
  public login(email: string, password: string): Observable<boolean> {
    const observable: Observable<boolean> = new Observable<boolean>(observer => {
      this.httpClient.post<LoginResponse>(`${environment.apiBaseURL}/login`, {
        email,
        password
      }).subscribe((res: LoginResponse) => {
        // handle success
        this.authService.setToken(res.token);
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
