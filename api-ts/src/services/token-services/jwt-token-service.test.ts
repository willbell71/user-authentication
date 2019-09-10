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
    it('should call sign', done => {
      tokenService.encrypt({})
        .then(() => {
          expect(jwt.sign).toHaveBeenCalledTimes(1);
          done();
        })
        .catch(err => done(err));
    });

    it('should reject on error', done => {
      tokenService.encrypt('')
        .then(() => done('invoked then block'))
        .catch(() => done());
    });

    it('should return token on success', done => {
      tokenService.encrypt({})
        .then(token => {
          expect(token).toEqual('token')
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('decrypt', () => {
    it('should call verify', done => {
      tokenService.decrypt('test')
        .then(() => {
          expect(jwt.verify).toHaveBeenCalled();
          done();
        })
        .catch(() => done('invoked catch block'));
    });

    it('should reject on error', done => {
      tokenService.decrypt('')
        .then(() => done('invoked catch then block'))
        .catch(() => done());
    });

    it('should return decoded payload on success', done => {
      tokenService.decrypt('test')
        .then(payload => {
          expect(payload).toEqual('payload')
          done();
        })
        .catch(() => done('invoked catch block'));
    });
  });
});
