import * as jwt from 'jsonwebtoken';

import {ITokenService} from './itoken-service';

/**
 * Token generator service using jwt.
 */
export class JWTTokenService implements ITokenService {
  // secret
  private secret: string;

  /**
   * Constructor.
   * @param {string} secret? - encryption secret.
   */
  constructor(secret?: string) {
    this.secret = secret || 'timeflies';
  }

  /**
   * Encrypt a given payload as a token.
   * @param {any} payload - payload to encrypt
   * @return {Promise<string>} return encrypted token.
   */
  encrypt(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, (err: Error, token: string) => {
        if (!err) {
          resolve(token);
        } else {
          reject(new Error('Failed to encrypt payload as JWT'));
        }
      });
    });
  }

  /**
   * Decrypt a token to it's original payload.
   * @param {string} token - token to decrypt.
   * @return {Promise<any>} return decrypted payload.
   */
  decrypt(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err: Error, decoded: any) => {
        if (!err) {
          resolve(decoded);
        } else {
          console.log('error', err);
          reject(new Error('Failed to decode JWT'));
        }
      });
    });
  }
}
