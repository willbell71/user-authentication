import { Response, Request, NextFunction, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';
import { IAuthService } from '../../model/auth/iauth-service';
import { ExpressAuthenticationMiddleware } from './middleware/express-authentication-middleware';

/**
 * Get something API endpoints.
 */
export class ExpressGetSomethingAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private authService: IAuthService;

  /**
   * Constructor
   * @param {ILogger} logger - logger service.
   * @param {IAuthService} authService - authentication service.
   */
  public constructor(logger: ILogger, authService: IAuthService) {
    this.logger = logger;
    this.authService = authService;
  }

  /**
   * Get something that requires the user to be logged in.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   */
  private getSomething(req: Request, res: Response): void {
    try {
      res.send({
        title: 'Content Title',
        body: 'Content Body'
      });
    } catch (_) {
      res.sendStatus(400);
    }
  }
  
  /**
   * Register route handlers.
   * @return {Router} return route handler.
   */
  public registerHandlers(): Router {
    const router: Router = Router();

    // register endpoints
    router.get('/',
      (req: Request, res: Response, next: NextFunction) =>
        ExpressAuthenticationMiddleware.auth(this.logger, req, res, next, this.authService),
      (req: Request, res: Response) => this.getSomething(req, res));

    return router;
  }
}
