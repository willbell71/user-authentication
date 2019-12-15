import { ILogger } from '../logger/ilogger';
import { ILogLine } from '../logger/ilog-line';
import { Logger } from '../logger/logger';
import { IShutdownHandler } from './ishutdown-handler';
import { ShutdownHandler } from './shutdown-handler';

/* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
// @ts-ignore
jest.spyOn(process, 'exit').mockImplementation(() => {});

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let handler: IShutdownHandler;
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

  handler = new ShutdownHandler(logger);
});
afterEach(() => jest.clearAllMocks());

describe('ShutdownHandler', () => {
  it('should exit with success ( 0 )', (done: jest.DoneCallback) => {
    process.emit('SIGINT', 'SIGINT');
      
    setTimeout(() => {
      expect(process.exit).toHaveBeenCalledTimes(1);
      expect(process.exit).toHaveBeenNthCalledWith(1, 0);

      done();
    }, 300);
  });

  describe('setErrorExitCode', () => {
    it('should log on setting exit code', () => {
      handler.setErrorExitCode(10);

      // once in creation and once now
      expect(logLineSpy).toHaveBeenCalledTimes(2);
    });

    it('should call process exit with code', (done: jest.DoneCallback) => {
      handler.setErrorExitCode(10);

      process.emit('SIGINT', 'SIGINT');
      
      setTimeout(() => {
        expect(process.exit).toHaveBeenCalledTimes(3);
        expect(process.exit).toHaveBeenNthCalledWith(2, 10);

        done();
      }, 300);
    });
  });

  describe('addCallback', () => {
    it('should log on registering callback', () => {
      handler.addCallback((): Promise<void> => Promise.resolve());

      // once in creation and once now
      expect(logLineSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('should call callback on exit', (done: jest.DoneCallback) => {
    const callback: jest.Mock = jest.fn();
    handler.addCallback(async (): Promise<void> => await callback());

    process.emit('SIGINT', 'SIGINT');
    
    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);

      done();
    }, 300);
  });
});
