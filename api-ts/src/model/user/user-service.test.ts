import { ILogLine } from '../../services/logger/ilog-line';
import { ILogger } from '../../services/logger/ilogger';
import { Logger } from '../../services/logger/logger';
import { IDBService } from '../../services/db/idb-service';
import { IPasswordService } from '../../services/password-service/ipassword-service';
import { ITokenService } from '../../services/token-services/itoken-service';
import { UserService } from './user-service';
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
let passwordService: IPasswordService;
let userService: UserService;
const user: TDBServiceEntity = {};
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
    decrypt: jest.fn().mockImplementation(() => new Promise((resolve: (value: string) => void): void => resolve('password')))
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

  passwordService = {
    encrypt: jest.fn().mockImplementation(() => new Promise((resolve: (value: string) => void): void => resolve('password'))),
    compare: jest.fn().mockImplementation((password: string, encrypt: string) => new Promise((resolve: (value: boolean) => void): void =>
      resolve(password === encrypt)
    ))
  };

  userService = new UserService(logger, tokenService, dbService, passwordService);
});
afterEach(() => {
  jest.restoreAllMocks();

  (dbService.setProp as jest.Mock).mockReset();
  (dbService.fetch as jest.Mock).mockReset();
  (tokenService.encrypt as jest.Mock).mockReset();
});

describe('UserService', () => {
  describe('register', () => {
    it('should create db entity user', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.create).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set prop firstName', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(6);
          expect(dbService.setProp).toHaveBeenNthCalledWith(1, user,　'firstName', 'first');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set prop lastName', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(6);
          expect(dbService.setProp).toHaveBeenNthCalledWith(2, user,　'lastName', 'last');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set prop email', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(6);
          expect(dbService.setProp).toHaveBeenNthCalledWith(3, user,　'email', 'email');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set prop password', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(6);
          expect(dbService.setProp).toHaveBeenNthCalledWith(4, user,　'password', 'password');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call token service encrypt', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(tokenService.encrypt).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set prop token', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(6);
          expect(dbService.setProp).toHaveBeenNthCalledWith(5, user,　'token', 'token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set last login', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(6);
          expect(dbService.setProp).toHaveBeenNthCalledWith(6, user,　'lastLogin', user.lastLogin);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call save on entity', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then(() => {
          expect(dbService.save).toHaveBeenCalledTimes(1);
          expect(dbService.save).toHaveBeenCalledWith(user);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should return token', (done: jest.DoneCallback) => {
      userService.register('first', 'last', 'email', 'password')
        .then((token: string) => {
          expect(token).toEqual('token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });

  describe('login', () => {
    it('should call fetch', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then(() => {
          expect(dbService.fetch).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should error if user doesnt exist', (done: jest.DoneCallback) => {
      userService.login('', 'password')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Failed to retrieve a user for email');
          done();
        });
    });

    it('should compare passwords', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then(() => {
          expect(passwordService.compare).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should error if passwords dont match', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', '')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Passwords dont match');
          done();
        });
    });

    it('should call encrypt', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then(() => {
          expect(tokenService.encrypt).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set token', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(2);
          expect(dbService.setProp).toHaveBeenNthCalledWith(1, user,　'token', 'token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should set last login', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(2);
          expect(dbService.setProp).toHaveBeenNthCalledWith(2, user,　'lastLogin', user.lastLogin);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call save', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then(() => {
          expect(dbService.save).toHaveBeenCalledTimes(1);
          expect(dbService.save).toHaveBeenCalledWith(user);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should return token', (done: jest.DoneCallback) => {
      user.password = 'password';

      userService.login('email', 'password')
        .then((token: string) => {
          expect(token).toEqual('token');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });

  describe('logout', () => {
    it('should set prop token', (done: jest.DoneCallback) => {
      userService.logout(user)
        .then(() => {
          expect(dbService.setProp).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call save', (done: jest.DoneCallback) => {
      userService.logout(user)
        .then(() => {
          expect(dbService.save).toHaveBeenCalledTimes(1);
          expect(dbService.save).toHaveBeenCalledWith(user);
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });
});
