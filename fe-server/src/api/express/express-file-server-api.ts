import { Response, Request, Router } from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IServerRouteHandler } from '../../services/server/iserver-route-handler';

/**
 * Server API endpoints.
 */
export class ExpressFileServerAPI implements IServerRouteHandler<Router> {
  private logger: ILogger;
  private route: string;
  private filePath: string;

  /**
   * Constructor
   * @param {ILogger} logger - logger service.
   * @param {string} route - route for file.
   * @param {string} filePath - file path.
   */
  public constructor(logger: ILogger, route: string, filePath: string) {
    this.logger = logger;
    this.route = route;
    this.filePath = filePath;
  }

  /**
   * Serve.
   * @param {Request} req - express request object.
   * @param {Resposne} res - express response object.
   * @return {void}
   */
  private serve(req: Request, res: Response): void {
    res.sendFile(this.filePath);
  }

  /**
   * Register route handlers.
   * @return {Router} return route handler.
   */
  public registerHandlers(): Router {
    const router: Router = Router();

    // register endpoints
    router.get(this.route, (req: Request, res: Response) => this.serve(req, res));

    return router;
  }
}
