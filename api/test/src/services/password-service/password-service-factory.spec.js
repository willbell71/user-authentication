const chai = require('chai');
const sinon = require('sinon');

const BCryptPasswordService = require('../../../../src/services/password-service/bcrypt-password-service');
const PasswordServiceFactory = require('../../../../src/services/password-service/password-service-factory');

const expect = chai.expect;

describe('PasswordServiceFactory class', () => {
  afterEach(() => sinon.restore());

  it('should return a type of bcrypt for bcrypt', () => {
    const bcryptPasswordService = PasswordServiceFactory.createPasswordService('bcrypt');

    expect(bcryptPasswordService instanceof BCryptPasswordService).to.eq(true);
  });

  it('should throw and log for unknown type', () => {
    const spy = sinon.spy();
    const logger = {
      error: spy
    };

    expect(() => PasswordServiceFactory.createPasswordService('', logger)).to.throw();
    expect(spy.callCount).to.eq(1);
  });
});
