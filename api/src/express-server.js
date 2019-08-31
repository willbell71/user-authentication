// @ts-check
'use strict';

const http = require('http');

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

/**
 * Set the root path for an API.
 * @param {Express} app - express app instance.
 * @param {string} path - root path for api routes.
 * @param {API} api - api routes to use root path for.
 */
function _setPathForAPI(app, path, api) {
  app.use(path, api.router);
}

/**
 * Class representing an Express server.
 */
class ExpressServer {
  /**
   * Constructor.
   * @param {Logger} logger - logger.
   * @param {any[]} routes - list of paths and associated controllers.
   */
  constructor(logger, routes) {
    this.logger = logger;

    // configure express
    this.app = express();
    this.app.set('port', process.env.PORT || process.env.LOGINAPI_PORT);
    this.app.use(helmet());
    if ('true' === process.env.LOGINAPI_USE_COMPRESSION) {
      this.logger.info('Server', 'Compression middleware enabled');
      this.app.use(compression());
    }
    this.app.use(morgan('dev', {
      stream: this.logger
    }));
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.text());
    this.app.use(bodyParser.json({type: 'application/json'}));
    if ('true' === process.env.LOGINAPI_DISABLE_CORS) {
      this.logger.info('Server', 'CORS disabled');
      this.app.use(cors());
    }

    // add routes and controllers
    if (routes) {
      routes.forEach(route => _setPathForAPI(this.app, route.path, route.controller));
    }
  }

  /**
   * Start server.
   */
  start() {
    // start server
    this.server = http.createServer(this.app);
    this.server.listen(this.app.get('port'), () => {
      this.logger.info('Server', `Express server listening on port ${this.app.get('port')}`);
    });
  }
}

module.exports = ExpressServer;
