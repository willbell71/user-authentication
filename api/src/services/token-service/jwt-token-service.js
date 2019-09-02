// @ts-check
'use strict';

const jwt = require('jsonwebtoken');

const TokenService = require('./token-service');

/**
 * Token generator service interface.
 */
class JWTTokenService extends TokenService {
  /**
   * Constructor.
   * @param {string} [secret] - encryption secret.
   */
  constructor(secret) {
    super();

    this.secret = secret || 'timeflies';
  }

  /**
   * Encrypt a given payload as a token.
   * @param {any} payload - payload to encrypt
   * @return {Promise<string>} return encrypted token.
   */
  encrypt(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secret, (err, token) => {
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
  decrypt(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded) => {
        if (!err) {
          resolve(decoded);
        } else {
          reject(new Error('Failed to decode JWT'));
        }
      });
    });
  }
}

module.exports = JWTTokenService;
