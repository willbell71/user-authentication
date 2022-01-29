import express from 'express';

import { ILogger } from '../../services/logger/ilogger';
import { ILogLine } from '../../services/logger/ilog-line';
import { Logger } from '../../services/logger/logger';
import { ExpressReadinessProbeAPI } from './express-readiness-probe-api';

let probe: (req: object, res: object) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get: jest.Mock = jest.fn().mockImplementation((...middleware: any[]) => {
    probe = middleware[1];
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
let expressReadinessProbeAPI: ExpressReadinessProbeAPI;
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

  expressReadinessProbeAPI = new ExpressReadinessProbeAPI(logger);
});
afterEach(() => jest.clearAllMocks());

describe('ExpressReadinessProbeAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressReadinessProbeAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a get route', () => {
      expressReadinessProbeAPI.registerHandlers();

      expect(express.Router().get).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressReadinessProbeAPI.registerHandlers();

      expect(router).toBeTruthy();
    });
  });

  describe('probe', () => {
    it('should call res.sendStatus with 400 when NOT ready', async () => {
      expressReadinessProbeAPI.registerHandlers();

      const sendStatus: jest.Mock = jest.fn();
      await probe({}, {
        sendStatus
      });

      expect(sendStatus).toHaveBeenCalledTimes(1);
      expect(sendStatus).toHaveBeenCalledWith(400);
    });

    it('should call res.sendStatus with 200 when ready', async () => {
      expressReadinessProbeAPI.setReady();
      expressReadinessProbeAPI.registerHandlers();

      const sendStatus: jest.Mock = jest.fn();
      await probe({}, {
        sendStatus
      });

      expect(sendStatus).toHaveBeenCalledTimes(1);
      expect(sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
