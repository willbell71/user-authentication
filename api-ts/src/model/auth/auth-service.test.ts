import { ILogLine } from '../../services/logger/ilog-line';
import { ILogger } from '../../services/logger/ilogger';
import { Logger } from '../../services/logger/logger';
import { IDBService } from '../../services/db/idb-service';
import { ITokenService } from '../../services/token-services/itoken-service';
import { AuthService } from './auth-service';
import { TDBServiceEntity } from '../../services/db/tdb-service-entity';

let logLineSpy: jest.Mock;
let warnLineSpy: jest.Mock;
let errorLineSpy: jest.Mock;
let assertLineSpy: jest.Mock;
let log: ILogLine;
let warn: ILogLine;
let error: ILogLine;
let assert: ILogLine;
let logger: ILogger;
let tokenService: ITokenService;
let dbService: IDBService;
let authService: AuthService;
const user: TDBServiceEntity = {
  token: 'token',
  lastLogin: new Date()
};
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

  tokenService = {
    encrypt: jest.fn().mockImplementation(() => new Promise((resolve: (value: string) => void): void => resolve('token'))),
    decrypt: jest.fn().mockImplementation(() => new Promise((resolve: (value: {id: string}) => void): void => resolve({id: 'user'})))
  };

  dbService = {
    connect: jest.fn().mockImplementation(() => new Promise((resolve: () => void): void => resolve())),
    create: jest.fn().mockImplementation(() => new Promise((resolve: (value: TDBServiceEntity) => void): void => resolve(user))),
    setProp: jest.fn().mockImplementation((entity: TDBServiceEntity, prop: string, value: string | Date) => entity[prop] = value),
    getProp: jest.fn().mockImplementation((entity: TDBServiceEntity, prop: string) => entity[prop] || 'value'),
    save: jest.fn().mockImplementation(() => new Promise((resolve: (success: boolean) => void): void => resolve(true))),
    fetch: jest.fn().mockImplementation((type: string, prop: string, value: string) => 
      new Promise((
        resolve: (value: TDBServiceEntity | undefined) => void
      ): void => { 
        if (value) {
          resolve(user);
        } else {
          resolve(undefined);
        }
      }))
  };

  authService = new AuthService(logger, tokenService, dbService);
});
afterEach(() => {
  jest.clearAllMocks();

  user.token = 'token';
  user.lastLogin = new Date();  
});

describe('AuthService', () => {
  describe('getAuthenticatedUserForToken', () => {
    it('should call itokenservice decrypt', (done: jest.DoneCallback) => {
      authService.getAuthenticatedUserForToken('token')
        .then(() => {
          expect(tokenService.decrypt).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call dbservice fetch', (done: jest.DoneCallback) => {
      authService.getAuthenticatedUserForToken('token')
        .then(() => {
          expect(dbService.fetch).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call dbservice getProp token', (done: jest.DoneCallback) => {
      authService.getAuthenticatedUserForToken('token')
        .then(() => {
          expect(dbService.getProp).toHaveBeenCalledTimes(2);
          expect(dbService.getProp).toHaveBeenNthCalledWith(1, user, 'token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call dbservice getProp lastLogin', (done: jest.DoneCallback) => {
      authService.getAuthenticatedUserForToken('token')
        .then(() => {
          expect(dbService.getProp).toHaveBeenCalledTimes(2);
          expect(dbService.getProp).toHaveBeenNthCalledWith(2, user, 'lastLogin');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call dbservice setProp, if token expired', (done: jest.DoneCallback) => {
      user.lastLogin = new Date(1);

      authService.getAuthenticatedUserForToken('token')
        .then(() => done('Invoked then block'))
        .catch(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(1);
          expect(dbService.setProp).toHaveBeenCalledWith(user, 'token');
          done();
        });
    });

    it('should call dbservice save, if token expired', (done: jest.DoneCallback) => {
      user.lastLogin = new Date(1);

      authService.getAuthenticatedUserForToken('token')
        .then(() => done('Invoked then block'))
        .catch(() => {
          expect(dbService.save).toHaveBeenCalledTimes(1);
          expect(dbService.save).toHaveBeenCalledWith(user);
          done();
        });
    });

    it('should error, if token expired', (done: jest.DoneCallback) => {
      user.lastLogin = new Date(1);

      authService.getAuthenticatedUserForToken('token')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Login expired');
          done();
        });
    });

    it('should return user on success', (done: jest.DoneCallback) => {
      authService.getAuthenticatedUserForToken('token')
        .then((fetchedUser: TDBServiceEntity) => {
          expect(fetchedUser).toEqual(user);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should error if tokens dont match', (done: jest.DoneCallback) => {
      authService.getAuthenticatedUserForToken('token2')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Tokens dont match');
          done();
        });
    });
  });
});
