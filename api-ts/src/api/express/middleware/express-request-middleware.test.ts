import { Request, Response } from 'express';

import { ILogLine } from '../../../services/logger/ilog-line';
import { ILogger } from '../../../services/logger/ilogger';
import { Logger } from '../../../services/logger/logger';
import { ExpressRequestMiddleware } from './express-request-middleware';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let req: Request;
let res: Response;
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

  req = {
    body: {
      firstName: 'First',
      lastName: 'Last'
    }
  } as unknown as Request;
  res = {
    sendStatus: jest.fn()
  } as unknown as Response;
});
afterEach(() => {
  jest.clearAllMocks();

  req = {
    body: {
      firstName: 'First',
      lastName: 'Last'
    }
  } as unknown as Request;
  res = {
    sendStatus: jest.fn()
  } as unknown as Response;
});

describe('ExpressRequestMiddleware', () => {
  describe('validateRequestBodyFields', () => {
    it('should call logger debug on start', () => {
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, jest.fn(), ['firstName', 'lastName']);

      expect(logLineSpy).toHaveBeenCalledTimes(2);
    });

    it('should validate case insenitive property names', () => {
      const next: jest.Mock = jest.fn();
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, next, ['FirstName', 'LastName']);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should call logger debug if validation fails', () => {
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, jest.fn(), ['firstName']);

      expect(logLineSpy).toHaveBeenCalledTimes(2);
    });

    it('should call res sendStatus 400 if validation fails', () => {
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, jest.fn(), ['firstName']);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(400);
    });

    it('should call logger debug if validation passes', () => {
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, jest.fn(), ['firstName', 'lastName']);

      expect(logLineSpy).toHaveBeenCalledTimes(2);
    });

    it('should call next if validation passes', () => {
      const next: jest.Mock = jest.fn();
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, next, ['firstName', 'lastName']);

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should call res send status 400 if it throws an error', () => {
      ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, jest.fn(), undefined as unknown as Array<string>);

      expect(res.sendStatus).toHaveBeenCalledTimes(1);
      expect(res.sendStatus).toHaveBeenCalledWith(400);
    });
  });
});
