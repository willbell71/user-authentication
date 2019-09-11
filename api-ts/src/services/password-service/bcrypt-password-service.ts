import * as bcrypt from 'bcrypt';

import { IPasswordService } from './ipassword-service';

/**
 * Password encryption service interface.
 */
export class BCryptPasswordService implements IPasswordService {
  // number of salt rounds
  private saltRounds: number;

  /**
   * Constructor.
   * @param {number} saltRounds? - number of salt rounds.
   */
  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  /**
   * Encrypt a given password.
   * @param {string} password - password to encrypt
   * @return {Promise<string>} return encrypted password.
   */
  encrypt(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(this.saltRounds, (err, salt) => {
        if (!err) {
          bcrypt.hash(password, salt, (err, hash) => {
            if (!err) {
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
  compare(password: string, encrypted: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, encrypted, (err, success) => {
        if (!err) {
          resolve(success);
        } else {
          reject(new Error('Failed to compare password'));
        }
      });
    });
  }
}
