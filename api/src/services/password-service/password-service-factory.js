// @ts-check
'use strict';

const BCryptPasswordService = require('./bcrypt-password-service');

/**
 * Password service factory.
 */
class PasswordServiceFactory {
  /**
   * Create a password service based on type.
   * @param {string} type - type of password service to create.
   * @param {Logger} logger - logger service.
   * @return {PasswordService} password service created.
   */
  static createPasswordService(type, logger) {
    switch (type) {
      case 'bcrypt': return new BCryptPasswordService();
      default:
        logger.error(`Unhandled password service type - ${type}`);
        throw (new Error(`Unhandled password service type - ${type}`));
    }
  }
}

module.exports = PasswordServiceFactory;
