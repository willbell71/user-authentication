import { Request, Response, NextFunction } from 'express';

import { ILogger } from '../../../services/logger/ilogger';

/**
 * Express middleware for validating request body properties against a whitelist.
 */
export class ExpressRequestMiddleware {
  /**
   * Validate a request body properties against a whitelist.
   * @param {ILogger} logger - logger service.
   * @param {Request} req - express request object.
   * @param {Response} res - express response object.
   * @param {NextFunction} next - next function in middleware chain.
   * @param {string[]} validFields - list of fields to whitelist.
   * @return {void}
   */
  public static validateRequestBodyFields(logger: ILogger,
    req: Request,
    res: Response,
    next: NextFunction,
    validFields: string[]): void {
    try {
      logger.debug('ExpressRequestValidators', 'Validating request body properties');
      // ensure all fields are lowercase
      validFields = validFields.map((field: string) => field.toLowerCase());
      // check each body property against field list
      const bodyProperties: string[] = Object.keys(req.body);
      for (let propCount: number = 0; propCount < bodyProperties.length; propCount++) {
        if (-1 === validFields.indexOf(bodyProperties[propCount].toLowerCase())) {
          // unknown field, bad request
          logger.debug('ExpressRequestValidators', 'Bad property found in request');
          res.sendStatus(400);
          return;
        }
      }

      logger.debug('ExpressRequestValidators', 'Property validation passed');

      next();
    } catch (_) {
      res.sendStatus(400);
    }
  }
}
