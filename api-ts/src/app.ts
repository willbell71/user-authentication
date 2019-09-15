import * as express from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { config } from './config/config';

import { Logger } from './services/logger/logger';
import { ILogger } from './services/logger/ilogger';
import { ELoggerLevel } from './services/logger/elogger-level';
import { LogLineConsoleLog } from './services/logger/log-line-console-log';
import { LogLineConsoleWarn } from './services/logger/log-line-console-warn';
import { LogLineConsoleError } from './services/logger/log-line-console-error';

import { IFactory } from './services/ifactory';

import { ITokenService } from './services/token-services/itoken-service';
import { TokenServiceFactory } from './services/token-services/token-service-factory';
import { JWTTokenService } from './services/token-services/jwt-token-service';

import { IPasswordService } from './services/password-service/ipassword-service';
import { PasswordServiceFactory } from './services/password-service/password-service-factory';
import { BCryptPasswordService } from './services/password-service/bcrypt-password-service';

import { IDBService } from './services/db/idb-service';
import { DBServiceFactory } from './services/db/db-service-factory';
import { MongoDBService } from './services/db/mongo-db-service';
import { IServerService } from './services/server/iserver-service';

import { ExpressServer } from './services/server/express-server/express-server';

// create logger
const logger: ILogger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(ELoggerLevel[config.logLevel as keyof typeof ELoggerLevel]);
logger.info('App', `running in mode: ${config.mode}`);

// create token service factory
const tokenServiceFactory: IFactory<ITokenService> = new TokenServiceFactory(logger);
tokenServiceFactory.registerService('jwt', JWTTokenService);

// create password service factory
const passwordServiceFactory: IFactory<IPasswordService> = new PasswordServiceFactory(logger);
passwordServiceFactory.registerService('bcrypt', BCryptPasswordService);

// create db service factory
const dbServiceFactory: IFactory<IDBService> = new DBServiceFactory(logger);
dbServiceFactory.registerService('mongo', MongoDBService);

// create db service
const dbService: IDBService = dbServiceFactory.createService('mongo');
dbService.connect(logger,
  config.dbConnection,
  [{
    name: 'User',
    schemaDefinition: {
      firstName: String,
      lastName: String,
      email: {type: String, index: true, unique: true},
      password: String,
      lastLogin: Date,
      token: String
    }
  }]);

// create server
const server: IServerService<express.RequestHandler, express.Router> = new ExpressServer();
// register middleware
server.registerMiddleware(helmet());
if (config.useCompression) {
  logger.info('App', 'Compression middleware enabled');
  server.registerMiddleware(compression());
}
server.registerMiddleware(morgan('dev', {stream: logger} as unknown as morgan.Options));
server.registerMiddleware(bodyParser.urlencoded({extended: true}));
server.registerMiddleware(bodyParser.text());
server.registerMiddleware(bodyParser.json({type: 'application/json'}));
if (config.disableCORS) {
  logger.info('App', 'CORS disabled');
  server.registerMiddleware(cors());
}
// start server
server.start(logger, config.port);
