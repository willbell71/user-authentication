// @ts-check
'use strict';

const validator = require('express-validator');

const ExpressAPI = require('./express-api');
const ExpressRequestMiddleware = require('./express-middleware/express-request-middleware');

/**
 * Register API endpoints.
 */
class ExpressRegisterAPI extends ExpressAPI {
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
        .sanitizeBody(['firstName', 'lastName', 'email'])
        .escape(),
      validator
        .body('firstName', 'Please enter a first name')
        .trim()
        .isLength({min: 1}),
      validator
        .body('lastName', 'Please enter a last name')
        .trim()
        .isLength({min: 1}),
      validator
        .body('email', 'Please enter an email address')
        .trim()
        .normalizeEmail()
        .isLength({min: 1}),
      validator
        .body('email', 'Please enter a valid email address')
        .isEmail(),
      validator
        .body('password', 'Password must be at least 6 characters')
        .isLength({min: 6}),
      (req, res, next) => ExpressRequestMiddleware.validateRequestBodyFields(
        this.logger,
        req,
        res,
        next,
        [
          'firstName',
          'lastName',
          'email',
          'password'
        ]),
      (req, res) => this.register(req, res));
  }

  /**
   * Create a new user in the db.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   */
  register(req, res) {
    try {
      const validation = validator.validationResult(req);
      if (validation.isEmpty()) {
        this.userService.register(req.body.firstName, req.body.lastName, req.body.email, req.body.password)
          .then(token => res.send({token}))
          .catch(err => {
            this.logger.error(err.message);
            res.sendStatus(400);
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

module.exports = ExpressRegisterAPI;
