import { Response, Request, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';

/**
 * Probe API endpoints.
 */
export class ExpressReadinessProbeAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private ready: boolean = false;

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
    res.sendStatus(this.ready ? 200 : 400);
  }

  /**
   * Register route handlers.
   * @return {Router} return route handler.
   */
  public registerHandlers(): Router {
    const router: Router = Router();

    // register endpoints
    router.get('/', (req: Request, res: Response) => this.probe(req, res));

    return router;
  }

  /**
   * Flag pod as ready.
   * @return {void}
   */
  public setReady(): void {
    this.logger.info('ExpressReadinessProbe', 'Pod now flagged as ready');

    this.ready = true;
  }
}
