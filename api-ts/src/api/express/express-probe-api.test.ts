import { ILogger } from '../../services/logger/ilogger';

let probe: (req: {}, res: {}) => void;
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

  const express: unknown = jest.fn().mockImplementation(() => ({
    use,
    Router
  }));

  (express as FakeExpress).Router = Router;

  return express;
});
import * as express from 'express';

import { ILogLine } from '../../services/logger/ilog-line';
import { Logger } from '../../services/logger/logger';
import { ExpressProbeAPI } from './express-probe-api';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let expressProbeAPI: ExpressProbeAPI;
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

  expressProbeAPI = new ExpressProbeAPI(logger);
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('ExpressProbeAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressProbeAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalled();
    });

    it('should register a get route', () => {
      expressProbeAPI.registerHandlers();

      expect(express.Router().get).toHaveBeenCalled();
    });

    it('should return router', () => {
      const router: express.Router = expressProbeAPI.registerHandlers();

      expect(router).toBeTruthy();
    });
  });

  describe('probe', () => {
    it('should call res.sendStatus on success', (done: jest.DoneCallback) => {
      expressProbeAPI.registerHandlers();

      const sendStatus: jest.Mock = jest.fn();
      probe({}, {
        sendStatus
      });

      setTimeout(() => {
        expect(sendStatus).toHaveBeenCalledTimes(1);
        expect(sendStatus).toHaveBeenCalledWith(200);
        done();
      }, 100);
    });
  });
});
