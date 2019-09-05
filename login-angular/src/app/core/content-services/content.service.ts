import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../auth-services/auth.service';
import { environment } from '../../../environments/environment';
import { ContentResponse } from './content-response';

/**
 * Content service.
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  /**
   * Constructor.
   * @param {AuthService} authService - authentication services provider.
   * @param {HttpClient} httpClient - http services provider.
   */
  constructor(private authService: AuthService,
              private httpClient: HttpClient) {}

  /**
   * Get some content.
   * @return {Observable<Something>} return observable with data.
   */
  public getContent(): Observable<ContentResponse> {
    return this.httpClient.get<ContentResponse>(`${environment.apiBaseURL}/getsomething`, {
      headers: new HttpHeaders({
        authorization: `Bearer ${this.authService.getToken()}`
      })
    });
  }
}
