// @ts-check
'use strict';

/**
 * Password encryption service interface.
 */
class PasswordService {
  /**
   * Encrypt a given password.
   * @param {string} password - password to encrypt
   * @return {Promise<string>} return encrypted password.
   */
  encrypt(password) {
    return new Promise((resolve, reject) => reject(new Error('Not implemented')));
  }

  /**
   * Compare a raw password against an encrypted password for a match.
   * @param {string} password - raw password to compare.
   * @param {string} encrypted - encrypted password to compare against.
   * @return {Promise<boolean>} return if passwords match.
   */
  compare(password, encrypted) {
    return new Promise((resolve, reject) => reject(new Error('Not implemented')));
  }
}

module.exports = PasswordService;
