import { ILogger } from '../../services/logger/ilogger';

const serve: {filePath: string; serve: (req: object, res: object) => void} = {
  filePath: 'filepath',
  serve: function() {}
};
// let serve: (req: {}, res: {}) => void;
jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get: jest.Mock = jest.fn().mockImplementation((...middleware: any[]) => {
    serve.serve = middleware[1];
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
import express from 'express';

import { ILogLine } from '../../services/logger/ilog-line';
import { Logger } from '../../services/logger/logger';
import { ExpressFileServerAPI } from './express-file-server-api';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let expressFileServerAPI: ExpressFileServerAPI;
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

  expressFileServerAPI = new ExpressFileServerAPI(logger, 'route', 'filepath');
});
afterEach(() => jest.clearAllMocks());

describe('ExpressFileServerAPI', () => {
  describe('registerHandlers', () => {
    it('should create a router', () => {
      expressFileServerAPI.registerHandlers();

      expect(express.Router).toHaveBeenCalledTimes(1);
    });

    it('should register a get route', () => {
      expressFileServerAPI.registerHandlers();

      expect(express.Router().get).toHaveBeenCalledTimes(1);
    });

    it('should return router', () => {
      const router: express.Router = expressFileServerAPI.registerHandlers();

      expect(router).toBeTruthy();
    });
  });

  describe('serve', () => {
    it('should call res.sendFile on success', () => {
      expressFileServerAPI.registerHandlers();

      const sendFile: jest.Mock = jest.fn();
      serve.serve({}, {
        sendFile
      });

      expect(sendFile).toHaveBeenCalledTimes(1);
      expect(sendFile).toHaveBeenCalledWith('filepath');
    });
  });
});
