import { Injectable } from '@angular/core';

/**
 * Service to track authenticated user.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user's auth token
  private token: string;

  /**
   * Auth service.
   */
  constructor() { }

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
  }

  /**
   * Get the user's auth token
   */
  public getToken(): string {
    return this.token;
  }
}
