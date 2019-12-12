import * as path from 'path';

import { RequestHandler, Router } from 'express';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as cors from 'cors';

import { config } from './config/config';

import { Logger } from './services/logger/logger';
import { ILogger } from './services/logger/ilogger';
import { ELoggerLevel } from './services/logger/elogger-level';
import { LogLineConsoleLog } from './services/logger/log-line-console-log';
import { LogLineConsoleWarn } from './services/logger/log-line-console-warn';
import { LogLineConsoleError } from './services/logger/log-line-console-error';

import { IServerService } from './services/server/iserver-service';

import { ExpressServer } from './services/server/express-server/express-server';

import { ExpressLivenessProbeAPI } from './api/express/express-liveness-probe-api';
import { ExpressFileServerAPI } from './api/express/express-file-server-api';

// create logger
const logger: ILogger = new Logger(new LogLineConsoleLog(),
  new LogLineConsoleWarn(),
  new LogLineConsoleError(),
  new LogLineConsoleError());
logger.setLevel(ELoggerLevel[config.logLevel as keyof typeof ELoggerLevel]);
logger.info('App', `running in mode: ${config.mode}`);

// create server
const server: IServerService<RequestHandler, Router> = new ExpressServer();
// register middleware
server.registerMiddleware(helmet());
if (config.useCompression) {
  logger.info('App', 'Compression middleware enabled');
  server.registerMiddleware(compression());
}
server.registerMiddleware(morgan('dev', {stream: logger} as unknown as morgan.Options));
if (config.disableCORS) {
  logger.info('App', 'CORS disabled');
  server.registerMiddleware(cors());
}
// register routes
server.registerRoute('/api/v1/livenessprobe', new ExpressLivenessProbeAPI(logger));
// server public folder
server.registerStaticPath(path.join(__dirname, '..', 'public'));
server.registerRoute('*', new ExpressFileServerAPI(logger, '*', path.join(__dirname, '..', 'public', 'index.html')));
// start server
server.start(logger, config.port);
