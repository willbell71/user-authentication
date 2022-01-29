import express from 'express';

import { ExpressAuthenticationMiddleware } from './middleware/express-authentication-middleware';
import { ILogLine } from '../../services/logger/ilog-line';
import { ILogger } from '../../services/logger/ilogger';
import { Logger } from '../../services/logger/logger';
import { ExpressGetSomethingAPI } from './express-get-something-api';
import { IAuthService } from '../../model/auth/iauth-service';
import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

jest.mock('./middleware/express-authentication-middleware');
ExpressAuthenticationMiddleware.auth = jest.fn().mockImplementation(() => {});

let auth: (logger: ILogger, req: object, res: object, next: () => void, authService: IAuthService) => void;
let getSomething: (req: object, res: object) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get: jest.Mock = jest.fn().mockImplementation((...middleware: any[]) => {
    auth = middleware[1];
    getSomething = middleware[2];
  });
  const Router: jest.Mock = jest.fn().mockImplementation(() => ({
    get
  }));

  type FakeExpress = {
    Router: jest.Mock;
  };

  const exp: unknown = jest.fn().mockImplementation(() => ({
    use,
    Router
  }));

  (exp as FakeExpress).Router = Router;

  return exp;
});

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
const user: TDBServiceEntity = {};
let authService: IAuthService;
let expressGetSomethingAPI: ExpressGetSomethingAPI;
beforeEach(() => {
  logLineSpy = jest.fn().mockImplementation(() => {});
  warnLineSpy = jest.fn().mockImplementation(() => {});
  errorLineSpy = jest.fn().mockImplementation(() => {});
  assertLineSpy = jest.fn().mockImplementation(() => {});

  log = {log: logLineSpy};
  warn = {log: warnLineSpy};
  error = {log: errorLineSpy};
  assert = {log: assertLineSpy};
  logger = new Logger(log, warn, error, assert);

  authService = {
    getAuthenticatedUserForToken: jest.fn().mockImplementation(() =>
      new Promise((resolve: (value: TDBServiceEntity) => void): void => resolve(user)))
  };

  expressGetSomethingAPI = new ExpressGetSomethingAPI(logger, authService);
});
afterEach(() => {
  jest.clearAllMocks();

  auth = undefined as unknown as (logge: ILogger, req: object, res: object, next: () => void, authServ: IAuthService) => void;
  getSomething = undefined as unknown as (req: object, res: object) => void;
});

describe('ExpressGetSomethingAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressGetSomethingAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a get route', () => {
      expressGetSomethingAPI.registerHandlers();

      expect(express.Router().get).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressGetSomethingAPI.registerHandlers();

      expect(router).toBeTruthy();
    });

    it('should use express authentication middleware', () => {
      expressGetSomethingAPI.registerHandlers();
      auth(logger, {}, {}, jest.fn(), authService);

      expect(ExpressAuthenticationMiddleware.auth).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSomething', () => {
    it('should call res.send with content', () => {
      expressGetSomethingAPI.registerHandlers();

      const send: jest.Mock = jest.fn();
      getSomething({}, {
        send
      });

      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith({title: 'Content Title', body: 'Content Body'});
    });

    it('should call res.sendStatus 400 on exceptin', () => {
      expressGetSomethingAPI.registerHandlers();

      const sendStatus: jest.Mock = jest.fn();
      getSomething({}, {
        sendStatus
      });

      expect(sendStatus).toHaveBeenCalledTimes(1);
      expect(sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
