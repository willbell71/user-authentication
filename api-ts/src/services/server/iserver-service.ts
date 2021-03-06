import { ILogger } from '../logger/ilogger';

import { IServerRouteHandler } from './iserver-route-handler';

/**
 * Server interface.
 * @param M - middleware type.
 * @param R - server route handler type.
 */
export interface IServerService<M, R> {
  /**
   * Register middleware.
   * @param {M} middleware - middleware to register.
   */
  registerMiddleware: (middleware: M) => void;

  /**
   * Register route
   * @param {string} path - path to register handler for.
   * @param {IServerRouteHandler<R>} handler - handler for path.
   */
  registerRoute: (path: string, handler: IServerRouteHandler<R>) => void;

  /**
   * Start server.
   * @param {ILogger} logger - logger service provider.
   * @param {number} port - port number for server to listen on.
   */
  start: (logger: ILogger, port: number) => void;
}
