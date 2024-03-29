import express from 'express';
import validator from 'express-validator';

import { ExpressRequestMiddleware } from './middleware/express-request-middleware';
import { ILogLine } from '../../services/logger/ilog-line';
import { ILogger } from '../../services/logger/ilogger';
import { Logger } from '../../services/logger/logger';
import { IUserService } from '../../model/user/iuser-service';
import { ExpressLoginAPI } from './express-login-api';

jest.mock('./middleware/express-request-middleware');
ExpressRequestMiddleware.validateRequestBodyFields = jest.fn().mockImplementation(() => {});

let login: (req: object, res: object) => void;
let validateRequestBodyFields: (req: object, res: object, next: () => void) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: jest.Mock = jest.fn().mockImplementation((...middleware: any[]) => {
    validateRequestBodyFields = middleware[5];
    login = middleware[6];
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

jest.mock('express-validator', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: (): any => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trim: (): any => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        normalizeEmail: (): any => ({
          isLength: (): void => {}
        })
      }),
      isEmail: (): void => {},
      isLength: (): void => {}
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sanitizeBody: (): any => ({
      escape: (): void => {}
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validationResult: jest.fn().mockImplementation((req: express.Request): any => ({
      isEmpty: (): boolean => {
        return !req.body || (req.body.email && req.body.password);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapped: (): any => ({})
    })),
    Result: {},
    ValidationError: {}
  };
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
let userService: IUserService;
let expressLoginAPI: ExpressLoginAPI;
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

  userService = {
    register: jest.fn().mockImplementation((): Promise<string> =>
      new Promise((resolve: (value: string) => void): void => resolve('token'))),
    login: jest.fn().mockImplementation((): Promise<string> =>
      new Promise((resolve: (value: string) => void): void => resolve('token'))),
    logout: jest.fn().mockImplementation((): Promise<void> =>
      new Promise((resolve: () => void): void => resolve()))
  };

  expressLoginAPI = new ExpressLoginAPI(logger, userService);
});
afterEach(() => {
  jest.clearAllMocks();

  login = undefined as unknown as (req: object, res: object) => void;
  validateRequestBodyFields = undefined as unknown as (req: object, res: object, next: () => void) => void;
});

describe('ExpressLoginAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressLoginAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a post route', () => {
      expressLoginAPI.registerHandlers();

      expect(express.Router().post).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressLoginAPI.registerHandlers();

      expect(router).toBeTruthy();
    });

    it('should use express request middleware', () => {
      expressLoginAPI.registerHandlers();
      validateRequestBodyFields({}, {}, jest.fn());

      expect(ExpressRequestMiddleware.validateRequestBodyFields).toHaveBeenCalledTimes(1);
    });

    describe('login', () => {
      it('should call validationResult', async () => {
        expressLoginAPI.registerHandlers();

        await login({
          body: {
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus: jest.fn()
        });

        expect(validator.validationResult).toHaveBeenCalledTimes(1);
      });

      it('should call logger error if validation fails', async () => {
        expressLoginAPI.registerHandlers();

        await login({
          body: {
            email: '',
            password: 'password'
          }
        }, {
          sendStatus: jest.fn()
        });

        expect(errorLineSpy).toHaveBeenCalledTimes(1);
      });

      it('should call sendStatus 400 if validation fails', async () => {
        expressLoginAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        await login({
          body: {
            email: '',
            password: 'password'
          }
        }, {
          sendStatus
        });

        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(400);
      });

      it('should call this.userService.login', async () => {
        expressLoginAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        await login({
          body: {
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus
        });

        expect(userService.login).toHaveBeenCalledTimes(1);
        expect(userService.login).toHaveBeenCalledWith('email', 'password');
      });


      it('should call res.send if login succeeds', async () => {
        expressLoginAPI.registerHandlers();

        const send: jest.Mock = jest.fn();
        await login({
          body: {
            email: 'email',
            password: 'password'
          }
        }, {
          send
        });

        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith({token: 'token'});
      });

      it('should logger error if login fails', async () => {
        expressLoginAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        await login({
          body: {
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus
        });

        expect(errorLineSpy).toHaveBeenCalledTimes(1);
      });

      it('should call res sendStatus 401 if login fails', async () => {
        expressLoginAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        await login({
          body: {
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus
        });

        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(401);
      });

      it('should call res senStatus 401 if it throws an exception', async () => {
        userService.login = jest.fn().mockImplementation((): Promise<string> =>
          new Promise((
            resolve: (value: string) => void,
            reject: (err: Error) => void
          ): void => reject(new Error('')))),

        expressLoginAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        await login({}, {
          sendStatus
        });

        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(401);
      });
    });
  });
});
