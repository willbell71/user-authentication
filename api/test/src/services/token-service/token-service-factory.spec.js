const chai = require('chai');
const sinon = require('sinon');

const JWTTokenService = require('../../../../src/services/token-service/jwt-token-service');
const TokenServiceFactory = require('../../../../src/services/token-service/token-service-factory');

const expect = chai.expect;

describe('TokenServiceFactory class', () => {
  afterEach(() => sinon.restore());

  it('should return a type of jwt for jwt', () => {
    const jwtTokenService = TokenServiceFactory.createTokenService('jwt');

    expect(jwtTokenService instanceof JWTTokenService).to.eq(true);
  });

  it('should throw and log for unknown type', () => {
    const spy = sinon.spy();
    const logger = {
      error: spy
    };

    expect(() => TokenServiceFactory.createTokenService('', logger)).to.throw();
    expect(spy.callCount).to.eq(1);
  });
});
