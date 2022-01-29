import http from 'http';
import express from 'express';

import { ILogger } from '../../logger/ilogger';
import { IServerService } from '../iserver-service';
import { IServerRouteHandler } from '../iserver-route-handler';

/**
 * Server interface.
 */
export class ExpressServer implements IServerService<express.RequestHandler, express.Router> {
  // http server
  private server?: http.Server;
  // express instance
  private app: express.Express;

  /**
   * Constructor.
   */
  public constructor() {
    this.app = express();
  }

  /**
   * Register middleware.
   * @param {express.RequestHandler} middleware - middleware to register.
   * @return {void}
   */
  public registerMiddleware(middleware: express.RequestHandler): void {
    this.app.use(middleware);
  }

  /**
   * Register route
   * @param {string} path - path to register handler for.
   * @param {IServerRouteHandler<express.Router>} handler - handler for path.
   * @return {void}
   */
  public registerRoute(path: string, handler: IServerRouteHandler<express.Router>): void {
    this.app.use(path, handler.registerHandlers());
  }

  /**
   * Start server.
   * @param {ILogger} logger - logger service provider.
   * @param {number} port - port number for server to listen on.
   * @return {void}
   */
  public start(logger: ILogger, port: number): void {
    // start server
    this.server = http.createServer(this.app);
    this.server.listen(port, () => {
      logger.info('Server', `Express server listening on port ${port}`);
    });
  }
}
