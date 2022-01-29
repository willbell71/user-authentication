import jwt from 'jsonwebtoken';

import { JWTTokenService } from './jwt-token-service';
import { ITokenService } from './itoken-service';

jest.mock('jsonwebtoken', () => {
  const sign: jest.Mock = jest.fn().mockImplementation((payload: string, secret: string, cb: (a: string | null, b: string) => void) =>
    cb((payload && secret) ? null : 'Error', 'token'));
  const verify: jest.Mock = jest.fn().mockImplementation((token: string, secret: string, cb: (a: string | null, b: string) => void) =>
    cb((token && secret) ? null : 'Error', 'payload'));

  return {
    sign,
    verify
  };
});

let tokenService: ITokenService;
beforeEach(() => {
  tokenService = new JWTTokenService();
});
afterEach(() => jest.clearAllMocks());

describe('JWTTokenService', () => {
  describe('encrypt', () => {
    it('should call sign', async () => {
      await tokenService.encrypt({});
      expect(jwt.sign).toHaveBeenCalledTimes(1);
    });

    it('should reject on error', async () => {
      await expect(tokenService.encrypt('')).rejects.toEqual(new Error('Failed to encrypt payload as JWT'));
    });

    it('should change secret', async () => {
      const jwtTokenService: JWTTokenService = new JWTTokenService();
      jwtTokenService.secret = '';
      await expect(jwtTokenService.encrypt('test')).rejects.toEqual(new Error('Failed to encrypt payload as JWT'));
    });

    it('should return token on success', async () => {
      const token: string = await tokenService.encrypt({});
      expect(token).toEqual('token');
    });
  });

  describe('decrypt', () => {
    it('should call verify', async () => {
      await tokenService.decrypt('test');
      expect(jwt.verify).toHaveBeenCalled();
    });

    it('should reject on error', async () => {
      await expect(tokenService.decrypt('')).rejects.toEqual(new Error('Failed to decode JWT'));
    });

    it('should return decoded payload on success', async () => {
      const payload: string | object | Buffer = await tokenService.decrypt('test');
      expect(payload).toEqual('payload');
    });
  });
});
