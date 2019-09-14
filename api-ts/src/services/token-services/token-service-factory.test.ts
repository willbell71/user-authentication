import { TokenServiceFactory } from './token-service-factory';

import { IFactory } from '../ifactory';
import { ITokenService } from './itoken-service';

import { ILogLine } from '../logger/ilog-line';
import { ILogger } from '../logger/ilogger';
import { Logger } from '../logger/logger';

class TokenTestService implements ITokenService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public encrypt(payload: string | object | Buffer): Promise<string> { return new Promise<string>((): void => {}); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public decrypt(token: string): Promise<string | object | Buffer> { return new Promise<string | object | Buffer>((): void => {}); }
}

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let factory: IFactory<ITokenService>;
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

  factory = new TokenServiceFactory(logger);  
  factory.registerService('test', TokenTestService);
});
afterEach(() => jest.restoreAllMocks());

describe('TokenServiceFactory', () => {
  it('should return a registered service', () => {
    const tokenService: ITokenService = factory.createService('test');
    expect(tokenService).toBeTruthy();
    expect(tokenService instanceof TokenTestService).toBeTruthy();

  });

  it('should throw and log for unknown type', () => {
    let failed: boolean = false;
    try {
      factory.createService('test2');
    } catch {
      failed = true;
    }
    expect(failed).toBeTruthy();
    expect(error.log).toHaveBeenCalledTimes(1);
  });
});
