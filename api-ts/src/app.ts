
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

// create logger
const logger: ILogger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(ELoggerLevel[(process.env.LOGINAPI_LOG_LEVEL || 'ALL') as keyof typeof ELoggerLevel]);
logger.info('App', `running in mode: ${process.env.LOGINAPI_NAME}`);

// create token service factory
const tokenServiceFactory: IFactory<ITokenService> = new TokenServiceFactory(logger);
tokenServiceFactory.registerService('jwt', new JWTTokenService());