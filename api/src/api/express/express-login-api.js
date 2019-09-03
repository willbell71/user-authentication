// @ts-check
'use strict';

const validator = require('express-validator');

const ExpressAPI = require('./express-api');
const ExpressRequestMiddleware = require('./express-middleware/express-request-middleware');

/**
 * Log in API endpoints.
 */
class ExpressLogInAPI extends ExpressAPI {
  /**
   * Constructor
   * @param {Logger} logger - logger service.
   * @param {UserService} userService - user service.
   */
  constructor(logger, userService) {
    super(logger);

    this.userService = userService;

    // register endpoints
    this.router.post('/',
      validator
        .sanitizeBody('email')
        .escape(),
      validator
        .body('email', 'Please enter an email address')
        .trim()
        .normalizeEmail()
        .isLength({min: 1}),
      validator
        .body('email', 'Please enter a valid email address')
        .isEmail(),
      validator
        .body('password', 'Please enter a password')
        .isLength({min: 1}),
      (req, res, next) => ExpressRequestMiddleware.validateRequestBodyFields(
        this.logger,
        req,
        res,
        next,
        [
          'email',
          'password'
        ]),
      (req, res) => this.login(req, res));
  }

  /**
   * Log in an existing user.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   */
  login(req, res) {
    try {
      const validation = validator.validationResult(req);
      if (validation.isEmpty()) {
        this.userService.login(req.body.email, req.body.password)
          .then(token => res.send({token}))
          .catch(err => {
            this.logger.error(err.message);
            res.sendStatus(401);
          });
      } else {
        this.logger.error(`Validation failed: ${JSON.stringify(validation.errors)}`);
        res.sendStatus(400);
      }
    } catch (_) {
      res.sendStatus(400);
    }
  }
}

module.exports = ExpressLogInAPI;
