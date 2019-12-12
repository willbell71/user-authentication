import { Response, Request, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';

/**
 * Probe API endpoints.
 */
export class ExpressLivenessProbeAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;

  /**
   * Constructor
   * @param {ILogger} logger - logger service.
   */
  public constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Probe.
   * @param {Request} req - express request object.
   * @param {Resposne} res - express response object.
   * @return {void}
   */
  private probe(req: Request, res: Response): void {
    res.sendStatus(200);
  }

  /**
   * Register route handlers.
   * @return {Router} return route handler.
   */
  public registerHandlers(): Router {
    const router: Router = Router();

    // register endpoints
    router.get('/', this.probe);

    return router;
  }
}
