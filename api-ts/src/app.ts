
require('dotenv').config();

import * as process from 'process';

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

// create logger
const logger: ILogger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(ELoggerLevel[(process.env.LOGINAPI_LOG_LEVEL || 'ALL') as keyof typeof ELoggerLevel]);
logger.info('App', `running in mode: ${process.env.LOGINAPI_NAME}`);

// create token service factory
const tokenServiceFactory: IFactory<ITokenService> = new TokenServiceFactory(logger);
tokenServiceFactory.registerService('jwt', JWTTokenService);

// create password service factory
const passwordServiceFactory: IFactory<IPasswordService> = new PasswordServiceFactory(logger);
passwordServiceFactory.registerService('bcrypt', BCryptPasswordService);

// create db service factory
const dbServiceFactory: IFactory<IDBService> = new DBServiceFactory(logger);
dbServiceFactory.registerService('mongo', MongoDBService);
