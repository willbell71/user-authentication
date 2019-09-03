// @ts-check
'use strict';

/**
 * Express middleware for validating request body properties against a whitelist.
 */
class ExpressRequestMiddleware {
  /**
   * Validate a request body properties against a whitelist.
   * @param {Logger} logger - logger service.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   * @param {function} next - next function in middleware chain.
   * @param {string[]} validFields - list of fields to whitelist.
   * @return {undefined}
   */
  static validateRequestBodyFields(logger, req, res, next, validFields) {
    try {
      logger.debug('ExpressRequestValidators', 'Validating request body properties');
      // ensure all fields are lowercase
      validFields = validFields.map(field => field.toLowerCase());
      // check each body property against field list
      const bodyProperties = Object.keys(req.body);
      for (let propCount = 0; propCount < bodyProperties.length; propCount++) {
        if (-1 === validFields.indexOf(bodyProperties[propCount].toLowerCase())) {
          // unknown field, bad request
          logger.debug('ExpressRequestValidators', 'Bad property found in request');
          return res.sendStatus(400);
        }
      }

      logger.debug('ExpressRequestValidators', 'Property validation passed');

      next();
    } catch (_) {
      res.sendStatus(400);
    }
  }
}

module.exports = ExpressRequestMiddleware;
