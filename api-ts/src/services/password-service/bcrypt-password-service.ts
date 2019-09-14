import * as bcrypt from 'bcrypt';

import { IPasswordService } from './ipassword-service';

/**
 * Password encryption service interface.
 */
export class BCryptPasswordService implements IPasswordService {
  // number of salt rounds
  private _saltRounds: number = 10;
  public set saltRounds(saltRounds: number) {
    this._saltRounds = saltRounds;
  }

  /**
   * Encrypt a given password.
   * @param {string} password - password to encrypt
   * @return {Promise<string>} return encrypted password.
   */
  public encrypt(password: string): Promise<string> {
    return new Promise<string>((
      resolve: ((value?: string | PromiseLike<string> | undefined) => void),
      reject: ((reason?: Error) => void)
    ): void => {
      bcrypt.genSalt(this._saltRounds, (saltErr: Error, salt: string) => {
        if (!saltErr) {
          bcrypt.hash(password, salt, (hashErr: Error, hash: string) => {
            if (!hashErr) {
              resolve(hash);
            } else {
              reject(new Error('Failed to hash password'));
            }
          });
        } else {
          reject(new Error('Failed to generate salt for password hashing'));
        }
      });
    });
  }

  /**
   * Compare a raw password against an encrypted password for a match.
   * @param {string} password - raw password to compare.
   * @param {string} encrypted - encrypted password to compare against.
   * @return {Promise<boolean>} return if passwords match.
   */
  public compare(password: string, encrypted: string): Promise<boolean> {
    return new Promise<boolean>((
      resolve: ((value?: boolean | PromiseLike<boolean> | undefined) => void),
      reject: ((reason?: Error) => void)
    ): void => {
      bcrypt.compare(password, encrypted, (err: Error, success: boolean) => {
        if (!err) {
          resolve(success);
        } else {
          reject(new Error('Failed to compare password'));
        }
      });
    });
  }
}
