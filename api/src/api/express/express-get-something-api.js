// @ts-check
'use strict';

const ExpressAPI = require('./express-api');
const ExpressAuthenticationMiddleware = require('./express-middleware/express-authentication-middleware');

/**
 * Get something API endpoints.
 */
class ExpressGetSomethingAPI extends ExpressAPI {
  /**
   * Constructor
   * @param {Logger} logger - logger service.
   * @param {AuthService} authService - authentication service.
   */
  constructor(logger, authService) {
    super(logger);

    this.authService = authService;

    // register endpoints
    this.router.get('/',
      (req, res, next) => ExpressAuthenticationMiddleware.auth(this.logger, req, res, next, this.authService),
      (req, res) => this.getSomething(req, res));
  }

  /**
   * Get something that requires the user to be logged in.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   */
  getSomething(req, res) {
    try {
      res.send({
        title: 'Content Title',
        body: 'Content Body'
      });
    } catch (_) {
      res.sendStatus(400);
    }
  }
}

module.exports = ExpressGetSomethingAPI;
