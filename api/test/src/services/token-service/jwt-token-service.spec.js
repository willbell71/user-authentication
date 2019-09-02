const chai = require('chai');
const sinon = require('sinon');

const jwt = require('jsonwebtoken');

const JWTTokenService = require('../../../../src/services/token-service/jwt-token-service');
const TokenService = require('../../../../src/services/token-service/token-service');

const expect = chai.expect;

describe('TokenServiceFactory class', () => {
  afterEach(() => sinon.restore());

  it('should create an instance', () => {
    expect(() => new JWTTokenService()).to.not.throw();
  });

  it('should be an instance of TokenService', () => {
    const jwtTokenService = new JWTTokenService();

    expect(jwtTokenService instanceof TokenService).to.eq(true);
  });

  it('should store the secret', () => {
    const jwtTokenService = new JWTTokenService('banana');

    expect(jwtTokenService.secret).to.eq('banana');
  });

  it('should default a secret if one not given', () => {
    const jwtTokenService = new JWTTokenService();

    expect(typeof jwtTokenService.secret).to.eq('string');
    expect(jwtTokenService.secret.length).to.gt(0);
  });

  describe('encrypt', () => {
    it('should call sign', done => {
      const compareStub = sinon.stub(jwt, 'sign').callsFake((payload, secret, cb) => cb(null, 'token'));

      const jwtTokenService = new JWTTokenService();

      jwtTokenService.encrypt()
        .then(() => {
          expect(compareStub.callCount).to.eq(1);
          done();
        })
        .catch(err => done(err));
    });

    it('should pass secret to sign', done => {
      const compareStub = sinon.stub(jwt, 'sign').callsFake((payload, secret, cb) => cb(null, 'token'));

      const jwtTokenService = new JWTTokenService('secret');

      jwtTokenService.encrypt()
        .then(() => {
          expect(compareStub.args[0][1]).to.eq('secret');
          done();
        })
        .catch(err => done(err));
    });

    it('should reject on error', done => {
      sinon.stub(jwt, 'sign').callsFake((payload, secret, cb) => cb('Failed to encrypt', 'token'));

      const jwtTokenService = new JWTTokenService();

      jwtTokenService.encrypt()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });

    it('should return token on success', done => {
      sinon.stub(jwt, 'sign').callsFake((payload, secret, cb) => cb(null, 'token'));

      const jwtTokenService = new JWTTokenService();

      jwtTokenService.encrypt()
        .then(token => {
          expect(token).to.eq('token');
          done();
        })
        .catch(err => done(err));
    });
  });

  describe('decrypt', () => {
    it('should call verify', done => {
      const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(null, 'payload'));

      const jwtTokenService = new JWTTokenService();

      jwtTokenService.decrypt()
        .then(() => {
          expect(verifyStub.callCount).to.eq(1);
          done();
        })
        .catch(err => done(err));
    });

    it('should pass secret to verify', done => {
      const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(null, 'payload'));

      const jwtTokenService = new JWTTokenService('secret');

      jwtTokenService.decrypt()
        .then(() => {
          expect(verifyStub.args[0][1]).to.eq('secret');
          done();
        })
        .catch(err => done(err));
    });

    it('should reject on error', done => {
      sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb('Failed to decrypt', 'payload'));

      const jwtTokenService = new JWTTokenService();

      jwtTokenService.decrypt()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });

    it('should return decoded payload on success', done => {
      sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(null, 'payload'));

      const jwtTokenService = new JWTTokenService();

      jwtTokenService.decrypt()
        .then(payload => {
          expect(payload).to.eq('payload');
          done();
        })
        .catch(err => done(err));
    });
  });
});
