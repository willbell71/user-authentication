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
  public constructor(secret?: string) {
    this.secret = secret || 'timeflies';
  }

  /**
   * Encrypt a given payload as a token.
   * @param {string | object | Buffer} payload - payload to encrypt
   * @return {Promise<string>} return encrypted token.
   */
  public encrypt(payload: string | object | Buffer): Promise<string> {
    return new Promise<string>((
      resolve: ((value?: string | PromiseLike<string> | undefined) => void),
      reject: ((reason?: Error) => void)
    ): void => {
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
   * @return {Promise<string | object | Buffer>} return decrypted payload.
   */
  public decrypt(token: string): Promise<string | object | Buffer> {
    return new Promise<string | object | Buffer>((
      resolve: ((value?: string | object | Buffer | PromiseLike<string | object | Buffer> | undefined) => void),
      reject: ((reason?: Error) => void)
    ): void => {
      jwt.verify(token, this.secret, (err: Error, decoded: string | object | Buffer) => {
        if (!err) {
          resolve(decoded);
        } else {
          reject(new Error('Failed to decode JWT'));
        }
      });
    });
  }
}
