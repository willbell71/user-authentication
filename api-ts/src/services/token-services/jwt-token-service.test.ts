import * as jwt from 'jsonwebtoken';

import { JWTTokenService } from './jwt-token-service';
import { ITokenService } from './itoken-service';

let tokenService: ITokenService;
beforeEach(() => {
  tokenService = new JWTTokenService();
});
afterEach(() => jest.restoreAllMocks());

describe('JWTTokenService', () => {
  describe('encrypt', () => {
    it('should call sign', (done: jest.DoneCallback) => {
      tokenService.encrypt({})
        .then(() => {
          expect(jwt.sign).toHaveBeenCalledTimes(1);
          done();
        })
        .catch((err: Error) => done(err));
    });

    it('should reject on error', (done: jest.DoneCallback) => {
      tokenService.encrypt('')
        .then(() => done('invoked then block'))
        .catch(() => done());
    });

    it('should return token on success', (done: jest.DoneCallback) => {
      tokenService.encrypt({})
        .then((token: string) => {
          expect(token).toEqual('token');
          done();
        })
        .catch((err: Error) => done(err));
    });
  });

  describe('decrypt', () => {
    it('should call verify', (done: jest.DoneCallback) => {
      tokenService.decrypt('test')
        .then(() => {
          expect(jwt.verify).toHaveBeenCalled();
          done();
        })
        .catch(() => done('invoked catch block'));
    });

    it('should reject on error', (done: jest.DoneCallback) => {
      tokenService.decrypt('')
        .then(() => done('invoked catch then block'))
        .catch(() => done());
    });

    it('should return decoded payload on success', (done: jest.DoneCallback) => {
      tokenService.decrypt('test')
        .then((payload: string | object | Buffer) => {
          expect(payload).toEqual('payload');
          done();
        })
        .catch(() => done('invoked catch block'));
    });
  });
});
