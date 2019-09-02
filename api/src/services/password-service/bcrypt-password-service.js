// @ts-check
'use strict';

const bcrypt = require('bcrypt');

const PasswordService = require('./password-service.js');

/**
 * Password encryption service interface.
 */
class BCryptPasswordService extends PasswordService {
  /**
   * Constructor.
   * @param {number} [saltRounds] - number of salt rounds.
   */
  constructor(saltRounds) {
    super();

    this.saltRounds = saltRounds || 10;
  }

  /**
   * Encrypt a given password.
   * @param {string} password - password to encrypt
   * @return {Promise<string>} return encrypted password.
   */
  encrypt(password) {
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
  compare(password, encrypted) {
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

module.exports = BCryptPasswordService;
