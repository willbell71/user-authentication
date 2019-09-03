// @ts-check
'use strict';

/**
 * Express middleware for validating request body properties against a whitelist.
 */
class ExpressAuthenticationMiddleware {
  /**
   * Validate a request body properties against a whitelist.
   * @param {Logger} logger - logger service.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   * @param {function} next - next function in middleware chain.
   * @param {AuthService} authService - authentication service.
   */
  static auth(logger, req, res, next, authService) {
    try {
      if (!req.headers.authorization) {
        // no token, unauthorised
        logger.debug('ExpressAuthenticationMiddleware', 'Missing authorization token');
        res.sendStatus(401);
        return;
      }

      // decode token
      const token = req.headers.authorization.substring('Bearer '.length);
      authService.getAuthenticatedUserForToken(token)
        .then(user => {
          req.user = user;
          logger.debug('ExpressAuthenticationMiddleware', 'User appears to be authorised, continuing with request');
          next();
        })
        .catch(err => {
          logger.error(err.message);
          res.sendStatus(401);
        });
    } catch (_) {
      res.sendStatus(400);
    }
  }
}

module.exports = ExpressAuthenticationMiddleware;
