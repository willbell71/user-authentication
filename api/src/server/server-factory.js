// @ts-check
'use strict';

const ExpressServer = require('./express-server');

/**
 * Server factory.
 */
class ServerFactory {
  /**
   * Create a server
   * @param {string} type - type of server to create.
   * @param {Logger} logger - logger service.
   * @param {{path: string, controller: API}[]} routes - list of routes and associated controllers.
   * @return {Server} returns the server for the type, if one exists.
   * @throws {Error} Will throw an error if the server type isn't recognised.
   */
  static createServer(type, logger, routes) {
    switch (type) {
      case 'express': return new ExpressServer(logger, routes);
      default:
        logger.error(`Unhandled server type - ${type}`);
        throw (new Error(`Unhandled server type - ${type}`));
    }
  }
}

module.exports = ServerFactory;
