import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { Something } from './something';

/**
 * Get something that requires authentication service.
 */
@Injectable({
  providedIn: 'root'
})
export class GetSomethingService {
  /**
   * Constructor.
   * @param {HttpClient} httpClient - http services provider.
   * @param {AuthService} authService - authentication services provider.
   */
  constructor(private httpClient: HttpClient,
              private authService: AuthService) {}

  /**
   * Get some data that requires an authenticated user.
   * @return {Observable<Something>} return observable with data.
   */
  public getSomething(): Observable<Something> {
    return this.httpClient.get<Something>(`${environment.apiBaseURL}/getsomething`, {
      headers: new HttpHeaders({
        authorization: `Bearer ${this.authService.getToken()}`
      })
    });
  }
}
