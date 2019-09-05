import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

import { SessionStorageService} from '../session-storage/session-storage.service';

/**
 * Service to track authenticated user.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  // token storage key
  private tokenStorageKey: string = 'token';

  // user's auth token
  private token: string;

  /**
   * Auth service.
   * @param {Router} router - provider for routing services.
   * @param {SessionStorageService} sessionStorageService - session storage provider.
   */
  constructor(private router: Router,
              private sessionStorageService: SessionStorageService) {
    this.token = this.sessionStorageService.getItem(this.tokenStorageKey);
  }

  /**
   * Check if user is authenticated.
   */
  public isAuthenticated(): boolean {
    return this.token ? true : false;
  }

  /**
   * Set user's auth token.
   * @param {string} token? - user's auth token
   */
  public setToken(token?: string): void {
    this.token = token;

    // store
    this.sessionStorageService.setItem(this.tokenStorageKey, this.token);
  }

  /**
   * Get the user's auth token
   */
  public getToken(): string {
    return this.token;
  }

  /**
   * Determine if route can be activated.
   * @param {ActivatedRouteSnapshot} route - activated route snapshot.
   * @param {RouterStateSnapshot} state - router state snapshot.
   * @return {Observable<boolean|UrlTree>} boolean if user is authenticated, new route if not.
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean|UrlTree> {
    if (this.isAuthenticated()) {
      // continue navigation
      return of(true);
    } else {
      // redirect to login
      return of(this.router.parseUrl('/login'));
    }
  }
}
