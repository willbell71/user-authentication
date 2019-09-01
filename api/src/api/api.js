/**
 * API class interface.
 */
class API {
  /**
   * Constructor.
   * @param {Logger} logger - logger service.
   */
  constructor(logger) {
    this.logger = logger;
  }
}

module.exports = API;
