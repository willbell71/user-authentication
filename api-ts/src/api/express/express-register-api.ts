import { Response, Request, NextFunction, Router } from 'express';
import { body, Result, sanitizeBody, validationResult, ValidationError } from 'express-validator';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';
import { IUserService } from '../../model/user/iuser-service';
import { ExpressRequestMiddleware } from './middleware/express-request-middleware';

/**
 * Register API endpoints.
 */
export class ExpressRegisterAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private userService: IUserService;

  /**
   * Constructor
   * @param {ILogger} logger - logger service.
   * @param {IUserService} userService - user service.
   */
  public constructor(logger: ILogger, userService: IUserService) {
    this.logger = logger;
    this.userService = userService;
  }

  /**
   * Create a new user in the db.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   * @return {Promise<void>} completion promise.
   */
  private async register(req: Request, res: Response): Promise<void> {
    try {
      const validation: Result<ValidationError> = validationResult(req);
      if (validation.isEmpty()) {
        const token: string = await this.userService
          .register(req.body.firstName, req.body.lastName, req.body.email, req.body.password);
        res.send({ token });
      } else {
        this.logger.error(`Validation failed: ${JSON.stringify(validation.mapped())}`);
        res.sendStatus(400);
      }
    } catch (err: unknown) {
      this.logger.error((err as Error).message);
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
      sanitizeBody(['firstName', 'lastName', 'email'])
        .escape(),
      body('firstName', 'Please enter a first name')
        .trim()
        .isLength({min: 1}),
      body('lastName', 'Please enter a last name')
        .trim()
        .isLength({min: 1}),
      body('email', 'Please enter an email address')
        .trim()
        .normalizeEmail()
        .isLength({min: 1}),
      body('email', 'Please enter a valid email address')
        .isEmail(),
      body('password', 'Password must be at least 6 characters')
        .isLength({min: 6}),
      (req: Request, res: Response, next: NextFunction) => ExpressRequestMiddleware.validateRequestBodyFields(
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
      (req: Request, res: Response) => this.register(req, res));

    return router;
  }
}
