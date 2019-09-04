import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AuthService } from '../auth-services/auth.service';

import { environment } from '../../../environments/environment';
import { RegisterResponse } from './register-response';

/**
 * Register new user service.
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  /**
   * Constructor.
   */
  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  /**
   * Register a new user.
   * @param {string} firstName - users first name.
   * @param {string} lastName - users last name.
   * @param {string} email - users email address.
   * @param {string} password - users password.
   * @return {Observable<boolean>} return observable with registration status.
   */
  public register(firstName: string, lastName: string, email: string, password: string): Observable<boolean> {
    const observable: Observable<boolean> = new Observable<boolean>(observer => {
      this.httpClient.post<RegisterResponse>(`${environment.apiBaseURL}/register`, {
        firstName,
        lastName,
        email,
        password
      }).subscribe((res: RegisterResponse) => {
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
