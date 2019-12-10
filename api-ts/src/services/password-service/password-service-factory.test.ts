import { PasswordServiceFactory } from './password-service-factory';

import { IFactory } from '../ifactory';
import { IPasswordService } from './ipassword-service';

import { ILogLine } from '../logger/ilog-line';
import { ILogger } from '../logger/ilogger';
import { Logger } from '../logger/logger';

class PasswordTestService implements IPasswordService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public encrypt(password: string): Promise<string> { return new Promise<string>((): void => {}); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public compare(password: string, encrypted: string): Promise<boolean> { return new Promise<boolean>((): void => {}); }
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
let factory: IFactory<IPasswordService>;
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

  factory = new PasswordServiceFactory(logger);
  factory.registerService('test', PasswordTestService);
});
afterEach(() => jest.clearAllMocks());

describe('PasswordServiceFactory', () => {
  it('should return a registered service', () => {
    const passwordService: IPasswordService = factory.createService('test');
    expect(passwordService).toBeTruthy();
    expect(passwordService instanceof PasswordTestService).toBeTruthy();
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
