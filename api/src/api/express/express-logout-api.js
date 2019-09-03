// @ts-check
'use strict';

const ExpressAPI = require('./express-api');
const ExpressRequestMiddleware = require('./express-middleware/express-request-middleware');
const ExpressAuthenticationMiddleware = require('./express-middleware/express-authentication-middleware');

/**
 * Log out API endpoints.
 */
class ExpressLogOutAPI extends ExpressAPI {
  /**
   * Constructor
   * @param {Logger} logger - logger service.
   * @param {AuthService} authService - authentication ervice.
   * @param {UserService} userService - user Service.
   */
  constructor(logger, authService, userService) {
    super(logger);

    this.authService = authService;
    this.userService = userService;

    // register endpoints
    this.router.get('/',
      (req, res, next) => ExpressAuthenticationMiddleware.auth(this.logger, req, res, next, this.authService),
      (req, res, next) => ExpressRequestMiddleware.validateRequestBodyFields(
        this.logger,
        req,
        res,
        next,
        []),
      (req, res) => this.logout(req, res));
  }

  /**
   * Log out a user.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   */
  logout(req, res) {
    try {
      this.userService.logout(req.user)
        .then(() => res.sendStatus(200))
        .catch(err => {
          this.logger.error(err.message);
          res.sendStatus(400);
        });
    } catch (_) {
      res.sendStatus(400);
    }
  }
}

module.exports = ExpressLogOutAPI;
