import { Response, Request, NextFunction, Router } from 'express';
import { body, Result, sanitizeBody, validationResult, ValidationError } from 'express-validator';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';
import { IUserService } from '../../model/user/iuser-service';
import { ExpressRequestMiddleware } from './middleware/express-request-middleware';

export class ExpressLoginAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private userService: IUserService;

  /**
   * Constructor.
   * @param {ILogger} logger - logger service provider.
   * @param {IUserService} userService - user service provider.
   */
  public constructor(logger: ILogger, userService: IUserService) {
    this.logger = logger;
    this.userService = userService;
  }

  /**
   * Log in an existing user.
   * @param {Request} req - express request object.
   * @param {Response} res - express response object.
   * @return {void}
   */
  private login(req: Request, res: Response): void {
    try {
      const validation: Result<ValidationError> = validationResult(req);
      if (validation.isEmpty()) {
        this.userService.login(req.body.email, req.body.password)
          .then((token: string) => res.send({token}))
          .catch((err: Error) => {
            this.logger.error(err.message);
            res.sendStatus(401);
          });
      } else {
        this.logger.error(`Validation failed: ${JSON.stringify(validation.mapped())}`);
        res.sendStatus(400);
      }
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

    router.post('/',
      sanitizeBody('email')
        .escape(),
      body('email', 'Please enter an email address')
        .trim()
        .normalizeEmail()
        .isLength({min: 1}),
      body('email', 'Please enter a valid email address')
        .isEmail(),
      body('password', 'Please enter a password')
        .isLength({min: 1}),
      (req: Request, res: Response, next: NextFunction) => ExpressRequestMiddleware.validateRequestBodyFields(
        this.logger,
        req,
        res,
        next,
        [
          'email',
          'password'
        ]),
      (req: Request, res: Response) => this.login(req, res));

    return router;
  }
}
