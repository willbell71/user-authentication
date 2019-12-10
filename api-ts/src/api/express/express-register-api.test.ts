let register: (req: {}, res: {}) => void;
let validateRequestBodyFields: (req: {}, res: {}, next: () => void) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post: jest.Mock = jest.fn().mockImplementation((...middleware: any[]) => {
    validateRequestBodyFields = middleware[7];
    register = middleware[8];
  });
  const Router: jest.Mock = jest.fn().mockImplementation(() => ({
    post
  }));

  type FakeExpress = {
    Router: jest.Mock;
  };

  const express: unknown = jest.fn().mockImplementation(() => ({
    use,
    Router
  }));

  (express as FakeExpress).Router = Router;

  return express;
});
import * as express from 'express';

jest.mock('express-validator', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: (): any => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trim: (): any => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        normalizeEmail: (): any => ({
          isLength: (): void => {}
        }),
        isLength: (): void => {}
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
import * as validator from 'express-validator';

import { ExpressRequestMiddleware } from './middleware/express-request-middleware';
jest.mock('./middleware/express-request-middleware');
ExpressRequestMiddleware.validateRequestBodyFields = jest.fn().mockImplementation(() => {});

import { ILogLine } from '../../services/logger/ilog-line';
import { ILogger } from '../../services/logger/ilogger';
import { Logger } from '../../services/logger/logger';
import { IUserService } from '../../model/user/iuser-service';
import { ExpressRegisterAPI } from './express-register-api';

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
let expressRegisterAPI: ExpressRegisterAPI;
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

  expressRegisterAPI = new ExpressRegisterAPI(logger, userService);
});
afterEach(() => {
  jest.clearAllMocks();

  register = undefined as unknown as (req: {}, res: {}) => void;
  validateRequestBodyFields = undefined as unknown as (req: {}, res: {}, next: () => void) => void;
});

describe('ExpressRegisterAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressRegisterAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a post route', () => {
      expressRegisterAPI.registerHandlers();

      expect(express.Router().post).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressRegisterAPI.registerHandlers();

      expect(router).toBeTruthy();
    });

    it('should use express request middleware', () => {
      expressRegisterAPI.registerHandlers();
      validateRequestBodyFields({}, {}, jest.fn());

      expect(ExpressRequestMiddleware.validateRequestBodyFields).toHaveBeenCalledTimes(1);
    });

    describe('register', () => {
      it('should call validationResult', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus: jest.fn()
        });

        setTimeout(() => {
          expect(validator.validationResult).toHaveBeenCalledTimes(1);
          done();
        }, 100);
      });

      it('should call logger error if validation fails', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: '',
            password: 'password'
          }
        }, {
          sendStatus: jest.fn()
        });

        setTimeout(() => {
          expect(errorLineSpy).toHaveBeenCalledTimes(1);
          done();
        }, 100);
      });

      it('should call sendStatus 400 if validation fails', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: '',
            password: 'password'
          }
        }, {
          sendStatus
        });

        setTimeout(() => {
          expect(sendStatus).toHaveBeenCalledTimes(1);
          expect(sendStatus).toHaveBeenCalledWith(400);
          done();
        }, 100);
      });

      it('should call this.userService.register', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus
        });

        setTimeout(() => {
          expect(userService.register).toHaveBeenCalledTimes(1);
          expect(userService.register).toHaveBeenCalledWith('first', 'last', 'email', 'password');
          done();
        }, 100);
      });


      it('should call res.send if register succeeds', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        const send: jest.Mock = jest.fn();
        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: 'email',
            password: 'password'
          }
        }, {
          send
        });

        setTimeout(() => {
          expect(send).toHaveBeenCalledTimes(1);
          expect(send).toHaveBeenCalledWith({token: 'token'});
          done();
        }, 100);
      });

      it('should logger error if register fails', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus
        });

        setTimeout(() => {
          expect(errorLineSpy).toHaveBeenCalledTimes(1);
          done();
        }, 100);
      });

      it('should call res sendStatus 400 if register fails', (done: jest.DoneCallback) => {
        expressRegisterAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        register({
          body: {
            firstName: 'first',
            lastName: 'last',
            email: 'email',
            password: 'password'
          }
        }, {
          sendStatus
        });

        setTimeout(() => {
          expect(sendStatus).toHaveBeenCalledTimes(1);
          expect(sendStatus).toHaveBeenCalledWith(400);
          done();
        }, 100);
      });

      it('should call res senStatus 400 if it throws an exception', (done: jest.DoneCallback) => {
        userService.register = jest.fn().mockImplementation((): Promise<string> =>
          new Promise((
            resolve: (value: string) => void,
            reject: (err: Error) => void
          ): void => reject(new Error('')))),

        expressRegisterAPI.registerHandlers();

        const sendStatus: jest.Mock = jest.fn();
        register({}, {
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
});
