import { Request, Response, NextFunction } from 'express';

import { ILogger } from '../../../services/logger/ilogger';
import { TDBServiceEntity } from '../../../services/db/tdb-service-entity';
import { IAuthService } from '../../../model/auth/iauth-service';

/**
 * Express middleware for validating request body properties against a whitelist.
 */
export class ExpressAuthenticationMiddleware {
  /**
   * Validate a request body properties against a whitelist.
   * @param {Logger} logger - logger service.
   * @param {Request} req - express request object.
   * @param {Response} res - express response object.
   * @param {NextFunction} next - next function in middleware chain.
   * @param {IAuthService} authService - authentication service.
   * @return {Promise<void>} completion promise.
   */
  public static async auth(logger: ILogger,
    req: Request & {user?: TDBServiceEntity},
    res: Response,
    next: NextFunction,
    authService: IAuthService): Promise<void> {
    try {
      if (!req.headers.authorization) {
        // no token, unauthorised
        logger.debug('ExpressAuthenticationMiddleware', 'Missing authorization token');
        res.sendStatus(401);
        return;
      }

      // decode token
      const token: string = req.headers.authorization.substring('Bearer '.length);
      const user: TDBServiceEntity = await authService.getAuthenticatedUserForToken(token);
      req.user = user;
      logger.debug('ExpressAuthenticationMiddleware', 'User appears to be authorised, continuing with request');
      next();
    } catch (err: unknown) {
      logger.error((err as Error).message);
      res.sendStatus(401);
    }
  }
}
