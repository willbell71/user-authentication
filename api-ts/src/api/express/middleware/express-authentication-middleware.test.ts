import { Request, Response } from 'express';

import { ILogLine } from '../../../services/logger/ilog-line';
import { ILogger } from '../../../services/logger/ilogger';
import { Logger } from '../../../services/logger/logger';
import { IAuthService } from '../../../model/auth/iauth-service';
import { TDBServiceEntity } from '../../../services/db/tdb-service-entity';
import { ExpressAuthenticationMiddleware } from './express-authentication-middleware';

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
let req: Request & {user?: TDBServiceEntity};
let res: Response;
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

  req = {
    headers: {
      authorization: 'Bearer token'
    }
  } as unknown as Request;
  res = {
    sendStatus: jest.fn()
  } as unknown as Response;
});
afterEach(() => {
  jest.clearAllMocks();

  authService = {
    getAuthenticatedUserForToken: jest.fn().mockImplementation(() =>
      new Promise((resolve: (value: TDBServiceEntity) => void): void => resolve(user)))
  };

  req = {
    headers: {
      authorization: 'Bearer token'
    }
  } as unknown as Request;
  res = {
    sendStatus: jest.fn()
  } as unknown as Response;
});

describe('ExpressAuthenticationMiddleware', () => {
  describe('auth', () => {
    it('should call logger debug if no auth token in request', async () => {
      req.headers = {};

      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(logLineSpy).toHaveBeenCalledTimes(1);
    });

    it('should call res sendStatus 401 if no auth token in request', async () => {
      req.headers = {};

      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should call authService getAuthenticatedUserForToken', async () => {
      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(authService.getAuthenticatedUserForToken).toHaveBeenCalledTimes(1);
      expect(authService.getAuthenticatedUserForToken).toHaveBeenCalledWith('token');
    });

    it('should add user to request if auth passes', async () => {
      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(req.user).toEqual(user);
    });

    it('should call logger debug if auth passes', async () => {
      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(logLineSpy).toHaveBeenCalledTimes(1);
    });

    it('should call next if auth passes', async () => {
      const next: jest.Mock = jest.fn();
      await ExpressAuthenticationMiddleware.auth(logger, req, res, next, authService);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should call logger error if no user for token', async () => {
      authService = {
        getAuthenticatedUserForToken: jest.fn().mockImplementation(() =>
          new Promise((
            resolve: (value: TDBServiceEntity) => void,
            reject: (err: Error) => void): void => reject(new Error(''))))
      };

      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(errorLineSpy).toHaveBeenCalledTimes(1);
    });

    it('should call res sendstatus 401 if no user for token', async () => {
      authService = {
        getAuthenticatedUserForToken: jest.fn().mockImplementation(() =>
          new Promise((
            resolve: (value: TDBServiceEntity) => void,
            reject: (err: Error) => void): void => reject(new Error(''))))
      };

      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should call res sendstatus 401 if exception is thrown', async () => {
      req = {} as unknown as Request;

      await ExpressAuthenticationMiddleware.auth(logger, req, res, jest.fn(), authService);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
    });
  });
});
