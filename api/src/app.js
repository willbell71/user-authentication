// @ts-check
'use strict';

require('dotenv').config();

const Logger = require('./logger/logger');
const LogLineConsoleLog = require('./logger/log-line-console-log');
const LogLineConsoleWarn = require('./logger/log-line-console-warn');
const LogLineConsoleError = require('./logger/log-line-console-error');
const ExpressServer = require('./express-server');
const ExpressTestAPI = require('./express-api/express-test-api');

// create logger
const logger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(process.env.LOGINAPI_LOG_LEVEL);
logger.info('App', `running in mode: ${process.env.LOGINAPI_NAME}`);

// start server
const server = new ExpressServer(logger, [{
  path: '/api/v1/test',
  controller: new ExpressTestAPI(logger)
}]);
server.start();
