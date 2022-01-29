import bcrypt from 'bcrypt';

import { BCryptPasswordService } from './bcrypt-password-service';
import { IPasswordService } from './ipassword-service';

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

let passwordService: IPasswordService;
beforeEach(() => {
  passwordService = new BCryptPasswordService();
});
afterEach(() => jest.clearAllMocks());

describe('BCryptPasswordService', () => {
  describe('encrypt', () => {
    it('should call genSalt', async () => {
      await passwordService.encrypt('password');
      expect(bcrypt.genSalt).toHaveBeenCalled();
    });

    it('should call hash', async () => {
      await passwordService.encrypt('password');
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should handled an error from genSalt', async () => {
      const bCryptPasswordService: BCryptPasswordService = new BCryptPasswordService();
      bCryptPasswordService.saltRounds = 0;
      await expect(bCryptPasswordService.encrypt('password')).rejects.toEqual(new Error('Failed to generate salt for password hashing'));
    });

    it('should handled an error from hash', async () => {
      passwordService = new BCryptPasswordService();
      await expect(passwordService.encrypt('')).rejects.toEqual(new Error('Failed to hash password'));
    });

    it('should return the result of hash', async () => {
      const hash: string = await passwordService.encrypt('password');
      expect(hash).toEqual('hash');
    });
  });

  // compare
  describe('compare', () => {
    it('should call compare', async () => {
      await passwordService.compare('password', 'password');
      expect(bcrypt.compare).toHaveBeenCalled();
    });

    it('should return true result of compare', async () => {
      const result: boolean = await passwordService.compare('password', 'password');
      expect(result).toBeTruthy();
    });

    it('should return false result of compare', async () => {
      const result: boolean = await passwordService.compare('password1', 'password2');
      expect(result).toBeFalsy();
    });

    it('should reject on error', async () => {
      await expect(passwordService.compare('', '')).rejects.toEqual(new Error('Failed to compare passwords'));
    });
  });
});
