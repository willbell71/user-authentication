import { Response, Request, NextFunction, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';
import { IAuthService } from '../../model/auth/iauth-service';
import { IUserService } from '../../model/user/iuser-service';
import { ExpressAuthenticationMiddleware } from './middleware/express-authentication-middleware';
import { ExpressRequestMiddleware } from './middleware/express-request-middleware';
import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

/**
 * Log out API endpoints.
 */
export class ExpressLogoutAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private authService: IAuthService;
  private userService: IUserService;

  /**
   * Constructor
   * @param {ILogger} logger - logger service.
   * @param {IAuthService} authService - authentication ervice.
   * @param {IUserService} userService - user Service.
   */
  public constructor(logger: ILogger, authService: IAuthService, userService: IUserService) {
    this.logger = logger;
    this.authService = authService;
    this.userService = userService;
  }

  /**
   * Log out a user.
   * @param {Request} req - express request object.
   * @param {Resposne} res - express response object.
   * @return {void}
   */
  private logout(req: Request & {user?: TDBServiceEntity}, res: Response): void {
    try {
      this.userService.logout(req.user)
        .then(() => res.send({}))
        .catch((err: Error) => {
          this.logger.error(err.message);
          res.sendStatus(400);
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
    router.post('/',
      (req: Request, res: Response, next: NextFunction) =>
        ExpressAuthenticationMiddleware.auth(this.logger, req, res, next, this.authService),
      (req: Request, res: Response, next: NextFunction) => ExpressRequestMiddleware.validateRequestBodyFields(
        this.logger,
        req,
        res,
        next,
        []),
      (req: Request, res: Response) => this.logout(req, res));

    return router;
  }
}
