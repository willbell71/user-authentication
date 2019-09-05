import { Injectable } from '@angular/core';

/**
 * Local Storage.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  /**
   * Constructor.
   */
  constructor() {}

  /**
   * Clear session storage,
   */
  public clear(): void {
    sessionStorage.clear();
  }

  /**
   * Remove item from session storage,
   * @param {string} key - key of item to remove.
   */
  public removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Set an item's value in session storage,
   * @param {string} key - key of item to set.
   * @param {string} value - value to set.
   */
  public setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  /**
   * Get an item's value in session storage,
   * @param {string} key - key of item to set.
   * @return {string} value of key in store.
   */
  public getItem(key: string): string {
    return sessionStorage.getItem(key);
  }
}
