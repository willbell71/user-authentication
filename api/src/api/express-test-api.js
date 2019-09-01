// @ts-check
'use strict';

const ExpressAPI = require('./express-api');

/**
 * Test API endpoints.
 */
class ExpressTestAPI extends ExpressAPI {
  /**
   * Register User API endpoints with express router.
   * @param {Logger} logger - logger service.
   */
  constructor(logger) {
    super(logger);

    // register endpoints
    this.router.get('/', this.test);
  }

  /**
   * Create a new user in the db.
   * @param {*} req - express request object.
   * @param {*} res - express response object.
   */
  test(req, res) {
    // TODO - do any express specific logic here, ie middleware, before calling model to perform operation
    res.sendStatus(200);
  }
}

module.exports = ExpressTestAPI;
