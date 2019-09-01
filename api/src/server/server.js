/**
 * Server class interface.
 */
class Server {
  /**
   * Constructor.
   * @param {Logger} logger - logger service.
   * @param {{path: string, controller: API}[]} routes - list of routes and associated controllers.
   */
  constructor(logger, routes) {
    this.logger = logger;
    this.routes = routes;
  }

  /**
   * Start server.
   */
  start() {}
}

module.exports = Server;
