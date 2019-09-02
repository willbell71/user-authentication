// @ts-check
'use strict';

const JWTTokenService = require('./jwt-token-service');

/**
 * Token service factory.
 */
class TokenServiceFactory {
  /**
   * Create a token service based on type.
   * @param {string} type - type of token service to create.
   * @param {Logger} logger - logger service.
   * @return {TokenService} token service created.
   */
  static createTokenService(type, logger) {
    switch (type) {
      case 'jwt': return new JWTTokenService();
      default:
        logger.error(`Unhandled token service type - ${type}`);
        throw (new Error(`Unhandled token service type - ${type}`));
    }
  }
}

module.exports = TokenServiceFactory;
