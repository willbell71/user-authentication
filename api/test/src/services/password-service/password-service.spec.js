const chai = require('chai');
const sinon = require('sinon');

const PasswordService = require('../../../../src/services/password-service/password-service');

const expect = chai.expect;

describe('PasswordService class', () => {
  afterEach(() => sinon.restore());

  it('should create an instance', () => {
    expect(() => new PasswordService()).to.not.throw();
  });

  describe('encrypt', () => {
    it('should throw for encrypt', done => {
      const passwordService = new PasswordService();

      passwordService
        .encrypt()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });

  describe('compare', () => {
    it('should throw for compare', done => {
      const passwordService = new PasswordService();

      passwordService
        .compare()
        .then(() => done('Called then on error'))
        .catch(() => done());
    });
  });
});
