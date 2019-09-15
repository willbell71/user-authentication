jest.mock('bcrypt', () => {
  const genSalt: jest.Mock = jest.fn().mockImplementation((saltRounds: number, cb: (a: string | null, b: string) => void) =>
    cb(saltRounds ? null : 'gensalt error', 'salt'));
  const hash: jest.Mock = jest.fn().mockImplementation((password: string, salt: string, cb: (a: string | null, b: string) => void) =>
    cb(password ? null : 'hash error', 'hash'));
  const compare: jest.Mock = jest.fn().mockImplementation((password: string, hash_: string, cb: (a: string | null, b: boolean) => void) =>
    cb(password ? null : 'compare error', password === hash_));
  
  return {
    genSalt,
    hash,
    compare
  };
});
import * as bcrypt from 'bcrypt';

import { BCryptPasswordService } from './bcrypt-password-service';
import { IPasswordService } from './ipassword-service';

let passwordService: IPasswordService;
beforeEach(() => {
  passwordService = new BCryptPasswordService();
});
afterEach(() => jest.restoreAllMocks());

describe('BCryptPasswordService', () => {
  describe('encrypt', () => {
    it('should call genSalt', (done: jest.DoneCallback) => {
      passwordService.encrypt('password')
        .then(() => {
          expect(bcrypt.genSalt).toHaveBeenCalled();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should call hash', (done: jest.DoneCallback) => {
      passwordService.encrypt('password')
        .then(() => {
          expect(bcrypt.hash).toHaveBeenCalled();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should handled an error from genSalt', (done: jest.DoneCallback) => {
      const bCryptPasswordService: BCryptPasswordService = new BCryptPasswordService();
      bCryptPasswordService.saltRounds = 0;
      bCryptPasswordService.encrypt('password')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Failed to generate salt for password hashing');
          done();
        });
    });

    it('should handled an error from hash', (done: jest.DoneCallback) => {
      passwordService = new BCryptPasswordService();
      passwordService.encrypt('')
        .then(() => done('Invoked then block'))
        .catch((err: Error) => {
          expect(err.message).toEqual('Failed to hash password');
          done();
        });
    });

    it('should return the result of hash', (done: jest.DoneCallback) => {
      passwordService.encrypt('password')
        .then((hash: string) => {
          expect(hash).toEqual('hash');
          done();
        })
        .catch(() => done('Invoked catch block'));
    });
  });

  // compare
  describe('compare', () => {
    it('should call compare', (done: jest.DoneCallback) => {
      passwordService.compare('password', 'password')
        .then(() => {
          expect(bcrypt.compare).toHaveBeenCalled();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should return true result of compare', (done: jest.DoneCallback) => {
      passwordService.compare('password', 'password')
        .then((result: boolean) => {
          expect(result).toBeTruthy();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should return false result of compare', (done: jest.DoneCallback) => {
      passwordService.compare('password1', 'password2')
        .then((result: boolean) => {
          expect(result).toBeFalsy();
          done();
        })
        .catch(() => done('Invoked catch block'));
    });

    it('should reject on error', (done: jest.DoneCallback) => {
      passwordService.compare('', '')
        .then(() => done('Invoked then block'))
        .catch(() => done());
    });
  });
});
