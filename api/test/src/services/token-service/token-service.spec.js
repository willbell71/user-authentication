const chai = require('chai');
const sinon = require('sinon');

const TokenService = require('../../../../src/services/token-service/token-service');

const expect = chai.expect;

describe('TokenService class', () => {
  afterEach(() => sinon.restore());

  it('should create an instance', () => {
    expect(() => new TokenService()).to.not.throw();
  });

  describe('encrypt', () => {
    it('should throw for encrypt', done => {
      const tokenService = new TokenService();

      tokenService
        .encrypt()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });

  describe('decrypt', () => {
    it('should throw for decrypt', done => {
      const tokenService = new TokenService();

      tokenService
        .decrypt()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });
});
