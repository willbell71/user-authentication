// @ts-check
'use strict';

require('dotenv').config();

const Logger = require('./services/logger/logger');
const LogLineConsoleLog = require('./services/logger/log-line-console-log');
const LogLineConsoleWarn = require('./services/logger/log-line-console-warn');
const LogLineConsoleError = require('./services/logger/log-line-console-error');

const DBServiceFactory = require('./services/db/db-service-factory');

const PasswordServiceFactory = require('./services/password-service/password-service-factory');
const TokenServiceFactory = require('./services/token-service/token-service-factory');

const AuthService = require('./model/auth/auth-service');
const UserService = require('./model/user/user-service');

const ServerFactory = require('./server/server-factory');
const ExpressLogInAPI = require('./api/express/express-login-api');
const ExpressLogOutAPI = require('./api/express/express-logout-api');
const ExpressRegisterAPI = require('./api/express/express-register-api');
const ExpressGetSomethingAPI = require('./api/express/express-get-something-api');

// create logger
const logger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(process.env.LOGINAPI_LOG_LEVEL);
logger.info('App', `running in mode: ${process.env.LOGINAPI_NAME}`);

// create db service
const dbService = DBServiceFactory.createDBService('mongo',
  logger,
  process.env.LOGINAPI_DB_CONNECTION,
  [{
    name: 'User',
    schema: {
      firstName: String,
      lastName: String,
      email: {type: String, index: true, unique: true},
      password: String,
      lastLogin: Date,
      token: String
    }
  }]);

// create child services
const passwordService = PasswordServiceFactory.createPasswordService('bcrypt', logger);
const tokenService = TokenServiceFactory.createTokenService('jwt', logger);

// create services required to fullfil api endpoints
const userService = new UserService(logger, tokenService, dbService, passwordService);
const authService = new AuthService(logger, tokenService, dbService);

// start server
try {
  const server = ServerFactory.createServer('express', logger, [{
    path: '/api/v1/login',
    controller: new ExpressLogInAPI(logger, userService)
  }, {
    path: '/api/v1/logout',
    controller: new ExpressLogOutAPI(logger, authService, userService)
  }, {
    path: '/api/v1/register',
    controller: new ExpressRegisterAPI(logger, userService)
  }, {
    path: '/api/v1/getsomething',
    controller: new ExpressGetSomethingAPI(logger, authService)
  }]);
  server.start();
} catch (err) {}
