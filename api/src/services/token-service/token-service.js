// @ts-check
'use strict';

/**
 * Token generator service interface.
 */
class TokenService {
  /**
   * Encrypt a given payload as a token.
   * @param {any} payload - payload to encrypt
   * @return {Promise<string>} return encrypted token.
   */
  encrypt(payload) {
    return new Promise((resolve, reject) => reject(new Error('Not implemented')));
  }

  /**
   * Decrypt a token to it's original payload.
   * @param {string} token - token to decrypt.
   * @return {Promise<any>} return decrypted payload.
   */
  decrypt(token) {
    return new Promise((resolve, reject) => reject(new Error('Not implemented')));
  }
}

module.exports = TokenService;
