import http from 'http';

import express from 'express';

import { ExpressServer } from './express-server';
import { ILogLine } from '../../logger/ilog-line';
import { ILogger } from '../../logger/ilogger';
import { Logger } from '../../logger/logger';

jest.mock('http', () => {
  const listen: jest.Mock = jest.fn().mockImplementation((port: number, cb: () => void) => cb());

  const createServer: jest.Mock = jest.fn().mockImplementation(() => ({
    listen
  }));

  return {
    createServer
  };
});

jest.mock('express', () => {
  const use: jest.Mock = jest.fn().mockImplementation(() => {});
  const Router: jest.Mock = jest.fn().mockImplementation(() => {});

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
let server: ExpressServer;
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

  server = new ExpressServer();
});
afterEach(() => jest.clearAllMocks());

describe('ExpressServer', () => {
  describe('registerMiddleware', () => {
    it('should call app use', () => {
      server.registerMiddleware(() => {});

      expect(express().use).toHaveBeenCalledTimes(1);
    });
  });

  describe('registerRoute', () => {
    it('should call app use', () => {
      server.registerRoute('', {
        registerHandlers: () => express.Router()
      });

      expect(express().use).toHaveBeenCalledTimes(1);
    });
  });

  describe('start', () => {
    it('should call create server', () => {
      server.start(logger, 3000);

      expect(http.createServer).toHaveBeenCalledTimes(1);
    });

    it('should call listen', () => {
      server.start(logger, 3000);

      expect(http.createServer().listen).toHaveBeenCalledTimes(1);
    });

    it('should call logger', () => {
      server.start(logger, 3000);

      expect(logLineSpy).toHaveBeenCalled();
    });
  });
});
