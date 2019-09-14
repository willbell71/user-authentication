import { DBServiceFactory } from './db-service-factory';

import { IFactory } from '../ifactory';
import { DBServiceEntity, DBServiceValue, IDBService } from './idb-service';

import { ILogLine } from '../logger/ilog-line';
import { ILogger } from '../logger/ilogger';
import { Logger } from '../logger/logger';

class DBTestService implements IDBService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function,@typescript-eslint/no-explicit-any
  public connect(logger: ILogger, connection: string, schema: any[]): Promise<void> { return new Promise<void>((): void => {}); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public create(entityType: string): Promise<DBServiceEntity> { return new Promise<DBServiceEntity>((): void => {}); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  public setProp(entity: DBServiceEntity, propName: string, value: DBServiceValue): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getProp(entity: DBServiceEntity, propName: string): DBServiceValue { return ''; }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public save(entity: DBServiceEntity): Promise<boolean> { return new Promise<boolean>((): void => {}); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public fetch(entityType: string, propName: string, value: DBServiceValue): Promise<DBServiceEntity> {
    return new Promise<DBServiceEntity>((): void => {});
  }
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
let factory: IFactory<IDBService>;
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

  factory = new DBServiceFactory(logger);
  factory.registerService('test', DBTestService);
});
afterEach(() => jest.restoreAllMocks());

describe('DBServiceFactory', () => {
  it('should return a registered service', () => {
    const dbService: IDBService = factory.createService('test');
    expect(dbService).toBeTruthy();
    expect(dbService instanceof DBTestService).toBeTruthy();
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
