import express from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { IAuthService } from '../../model/auth/iauth-service';
import { ExpressRequestMiddleware } from './middleware/express-request-middleware';
import { ExpressAuthenticationMiddleware } from './middleware/express-authentication-middleware';
import { ILogLine } from '../../services/logger/ilog-line';
import { Logger } from '../../services/logger/logger';
import { IUserService } from '../../model/user/iuser-service';
import { ExpressLogoutAPI } from './express-logout-api';
import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

let auth: (logger: ILogger, req: object, res: object, next: () => void, authService: IAuthService) => void;
let validateRequestBodyFields: (req: object, res: object, next: () => void) => void;
let logout: (req: object, res: object) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: jest.Mock = jest.fn().mockImplementation((...middleware: any[]) => {
    auth = middleware[1];
    validateRequestBodyFields = middleware[2];
    logout = middleware[3];
  });
  const Router: jest.Mock = jest.fn().mockImplementation(() => ({
    post
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

jest.mock('./middleware/express-request-middleware');
ExpressRequestMiddleware.validateRequestBodyFields = jest.fn().mockImplementation(() => {});

jest.mock('./middleware/express-authentication-middleware');
ExpressAuthenticationMiddleware.auth = jest.fn().mockImplementation(() => {});

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let authService: IAuthService;
let userService: IUserService;
let expressLogoutAPI: ExpressLogoutAPI;
const user: TDBServiceEntity = {};
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

  userService = {
    register: jest.fn().mockImplementation((): Promise<string> =>
      new Promise((resolve: (value: string) => void): void => resolve('token'))),
    login: jest.fn().mockImplementation((): Promise<string> =>
      new Promise((resolve: (value: string) => void): void => resolve('token'))),
    logout: jest.fn().mockImplementation((): Promise<void> =>
      new Promise((resolve: () => void): void => resolve()))
  };

  expressLogoutAPI = new ExpressLogoutAPI(logger, authService, userService);
});
afterEach(() => {
  jest.clearAllMocks();

  auth = undefined as unknown as (logge: ILogger, req: object, res: object, next: () => void, authServic: IAuthService) => void;
  validateRequestBodyFields = undefined as unknown as (req: object, res: object, next: () => void) => void;
  logout = undefined as unknown as (req: object, res: object) => void;
});

describe('ExpressLoginAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressLogoutAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a post route', () => {
      expressLogoutAPI.registerHandlers();

      expect(express.Router().post).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressLogoutAPI.registerHandlers();

      expect(router).toBeTruthy();
    });

    it('should use express authentication middleware', () => {
      expressLogoutAPI.registerHandlers();
      auth(logger, {}, {}, jest.fn(), authService);

      expect(ExpressAuthenticationMiddleware.auth).toHaveBeenCalledTimes(1);
    });

    it('should use express request middleware', () => {
      expressLogoutAPI.registerHandlers();
      validateRequestBodyFields({}, {}, jest.fn());

      expect(ExpressRequestMiddleware.validateRequestBodyFields).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should call logout', async () => {
      expressLogoutAPI.registerHandlers();

      await logout({
        user
      }, {
        send: jest.fn().mockImplementation(() => {})
      });

      expect(userService.logout).toHaveBeenCalledTimes(1);
      expect(userService.logout).toHaveBeenCalledWith(user);
    });

    it('should call res.send on success', async () => {
      expressLogoutAPI.registerHandlers();

      const send: jest.Mock = jest.fn();
      await logout({
        user
      }, {
        send
      });

      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith({});
    });

    it('should call logger error on failure', (done: jest.DoneCallback) => {
      userService.logout = jest.fn().mockImplementation((): Promise<void> =>
        new Promise((
          resolve: () => void,
          reject: (err: Error) => void
        ): void => reject(new Error(''))));

      expressLogoutAPI.registerHandlers();

      logout({
        user
      }, {
        sendStatus: jest.fn().mockImplementation(() => {})
      });

      setTimeout(() => {
        expect(errorLineSpy).toHaveBeenCalledTimes(1);
        done();
      }, 100);
    });

    it('should call sendStatus 400 on error', (done: jest.DoneCallback) => {
      userService.logout = jest.fn().mockImplementation((): Promise<void> =>
        new Promise((
          resolve: () => void,
          reject: (err: Error) => void
        ): void => reject(new Error(''))));

      expressLogoutAPI.registerHandlers();

      const sendStatus: jest.Mock = jest.fn().mockImplementation(() => {});
      logout({
        user
      }, {
        sendStatus
      });

      setTimeout(() => {
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });

    it('should call sendStatus 400 on exception', (done: jest.DoneCallback) => {
      expressLogoutAPI.registerHandlers();

      const sendStatus: jest.Mock = jest.fn();
      logout(undefined as unknown as express.Request, {
        sendStatus
      });

      setTimeout(() => {
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(400);
        done();
      }, 100);
    });
  });
});
