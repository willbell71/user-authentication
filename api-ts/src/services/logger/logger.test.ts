import { Writable } from 'stream';

import { Logger } from './logger';
import { ELoggerLevel } from './elogger-level';
import { ILogger } from './ilogger';
import { ILogLine } from './ilog-line';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
beforeEach(() => {
  logLineSpy = jest.fn();
  warnLineSpy = jest.fn();
  errorLineSpy = jest.fn();
  assertLineSpy = jest.fn();

  log = {log: logLineSpy};
  warn = {log: warnLineSpy};
  error = {log: errorLineSpy};
  assert = {log: assertLineSpy};
  logger = new Logger(log, warn, error, assert);
});
afterEach(() => jest.restoreAllMocks());

describe('Logger', () => {
  it('should return an instance of Writable', () => {
    expect(logger instanceof Writable).toEqual(true);
  });

  it('should take an array of loggers', () => {
    const log2: ILogLine = {
      log: jest.fn()
    };

    logger = new Logger([log, log2], warn, error, assert);
    logger.setLevel(ELoggerLevel.ALL);

    logger.debug('Test', 'Test message');

    expect(log.log).toHaveBeenCalledTimes(1);
    expect(log2.log).toHaveBeenCalledTimes(1);
    expect(warn.log).toHaveBeenCalledTimes(0);
    expect(error.log).toHaveBeenCalledTimes(0);
    expect(assert.log).toHaveBeenCalledTimes(0);
  });

  describe('debug', () => {
    it('should call debug logger, if log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.debug('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(1);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });

    it('should not call debug logger, if log level is too high', () => {
      logger.setLevel(ELoggerLevel.NONE);

      logger.debug('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('verbose', () => {
    it('should call verbose logger, if log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.verbose('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(1);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });

    it('should not call verbose logger, if log level is too high', () => {
      logger.setLevel(ELoggerLevel.NONE);

      logger.verbose('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('info', () => {
    it('should call info logger, if log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.info('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(1);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });

    it('should not call info logger, if log level is too high', () => {
      logger.setLevel(ELoggerLevel.NONE);

      logger.info('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('warn', () => {
    it('should call warn logger, if log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.warn('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(1);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });

    it('should not call warn logger, if log level is too high', () => {
      logger.setLevel(ELoggerLevel.NONE);

      logger.warn('Test', 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('error', () => {
    it('should call error logger, if log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.error('Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(1);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });

    it('should not call error logger, if log level is too high', () => {
      logger.setLevel(ELoggerLevel.NONE);

      logger.error('Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('assert', () => {
    it('should call assertion logger, if condition is false, and log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.assert(false, 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(1);
    });

    it('should not call assertion logger, if condition is false, and log level is too high', () => {
      logger.setLevel(ELoggerLevel.NONE);

      logger.assert(false, 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });

    it('should not call assertion logger, if condition is true, and log level is low enough', () => {
      logger.setLevel(ELoggerLevel.ALL);

      logger.assert(true, 'Test message');

      expect(log.log).toHaveBeenCalledTimes(0);
      expect(warn.log).toHaveBeenCalledTimes(0);
      expect(error.log).toHaveBeenCalledTimes(0);
      expect(assert.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('_write', () => {
    it('should call verbose logger', () => {
      const logLine: ILogLine = {
        log: jest.fn()
      };
      const otherLogLine: ILogLine = {
        log: jest.fn()
      };

      const localLogger: Logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      localLogger.setLevel(ELoggerLevel.ALL);

      localLogger._write('test', 'utf8', () => {});

      expect(logLine.log).toHaveBeenCalledTimes(1);
      expect(otherLogLine.log).toHaveBeenCalledTimes(0);
    });

    it('should not call verbose logger if log level is too high', () => {
      const logLine: ILogLine = {
        log: jest.fn()
      };
      const otherLogLine: ILogLine = {
        log: jest.fn()
      };

      const localLogger: Logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      localLogger.setLevel(ELoggerLevel.NONE);

      localLogger._write('test', 'utf8', () => {});

      expect(logLine.log).toHaveBeenCalledTimes(0);
      expect(otherLogLine.log).toHaveBeenCalledTimes(0);
    });

    it('should call the callback', () => {
      const logLine: ILogLine = {
        log: jest.fn()
      };
      const spy: jest.Mock = jest.fn();

      const localLogger: Logger = new Logger(logLine, logLine, logLine, logLine);
      localLogger.setLevel(ELoggerLevel.ALL);

      localLogger._write('test', 'utf8', spy);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
