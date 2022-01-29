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
   * @return {Promise<void>} completion promise.
   */
  private async login(req: Request, res: Response): Promise<void> {
    try {
      const validation: Result<ValidationError> = validationResult(req);
      if (validation.isEmpty()) {
        const token: string = await this.userService.login(req.body.email, req.body.password);
        res.send({ token });
      } else {
        this.logger.error(`Validation failed: ${JSON.stringify(validation.mapped())}`);
        res.sendStatus(400);
      }
    } catch (error: unknown) {
      this.logger.error((error as Error).message);
      res.sendStatus(401);
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
