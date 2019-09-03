// @ts-check
'use strict';

/**
 * Auth service.
 */
class AuthService {
  /**
   * Constructor.
   * @param {Logger} loggerService - logger service.
   * @param {TokenService} tokenService - token service.
   * @param {DBService} dbService - db service.
   */
  constructor(loggerService, tokenService, dbService) {
    // store services
    this.loggerService = loggerService;
    this.tokenService = tokenService;
    this.dbService = dbService;
  }

  /**
   * Get an authentication user, if token is valid.
   * @param {string} token - authentication token.
   * @return {Promise<any>} user, if authentication passes.
   */
  async getAuthenticatedUserForToken(token) {
    // get user id from auth token
    const {id} = await this.tokenService.decrypt(token);
    // get user for id
    const user = await this.dbService.fetch('User', 'id', id);
    // ensure this token is valid/active for this user
    const storedToken = this.dbService.getProp(user, 'token');
    if (storedToken && storedToken === token) {
      // check token hasn't expired
      const now = new Date();
      const maxSessionDuration = 1000 * 60 * 60;
      const lastLogin = this.dbService.getProp(user, 'lastLogin');
      if (now.getTime() > lastLogin.getTime() + maxSessionDuration) {
        // log user out
        this.dbService.setProp(user, 'token');
        await this.dbService.save(user);
        // reject
        throw (new Error('Login expired'));
      }

      // if everything passed, return user
      return user;
    } else {
      throw new Error('Tokens dont match');
    }
  }
}

module.exports = AuthService;
