const chai = require('chai');
const sinon = require('sinon');

const bcrypt = require('bcrypt');

const PasswordService = require('../../../../src/services/password-service/password-service');
const BCryptPasswordService = require('../../../../src/services/password-service/bcrypt-password-service');

const expect = chai.expect;

describe('BCryptPasswordService class', () => {
  afterEach(() => sinon.restore());

  it('should return an instance of PasswordService', () => {
    const bcryptPasswordService = new BCryptPasswordService();

    expect(() => new BCryptPasswordService()).to.not.throw();
    expect(bcryptPasswordService instanceof PasswordService).to.eq(true);
  });

  it('should should store salt rounds when passed', () => {
    const bcryptPasswordService = new BCryptPasswordService(100);

    expect(bcryptPasswordService.saltRounds).to.eq(100);
  });

  it('should should default salt rounds when not passed', () => {
    const bcryptPasswordService = new BCryptPasswordService();

    expect(bcryptPasswordService.saltRounds).to.gt(0);
  });

  // encrypt
  describe('encrypt', () => {
    it('should call genSalt', done => {
      const genSaltStub = sinon.stub(bcrypt, 'genSalt').callsFake((salt, cb) => cb(null, 'salt'));
      sinon.stub(bcrypt, 'hash').callsFake((password, salt, cb) => cb(null, 'hash'));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.encrypt('test')
        .then(() => {
          expect(genSaltStub.callCount).to.eq(1);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should call hash', done => {
      sinon.stub(bcrypt, 'genSalt').callsFake((salt, cb) => cb(null, 'salt'));
      const hashStub = sinon.stub(bcrypt, 'hash').callsFake((password, salt, cb) => cb(null, 'hash'));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.encrypt('test')
        .then(() => {
          expect(hashStub.callCount).to.eq(1);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should handled an error from genSalt', done => {
      sinon.stub(bcrypt, 'genSalt').callsFake((salt, cb) => cb('Failed to generate salt'));
      sinon.stub(bcrypt, 'hash').callsFake((password, salt, cb) => cb(null, 'hash'));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.encrypt('test')
        .then(() => {
          done('Called then on error');
        })
        .catch(err => {
          done();
        });
    });

    it('should handled an error from hash', done => {
      sinon.stub(bcrypt, 'genSalt').callsFake((salt, cb) => cb(null, 'salt'));
      sinon.stub(bcrypt, 'hash').callsFake((password, salt, cb) => cb('Failed to hash password'));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.encrypt('test')
        .then(() => {
          done('Called then on error');
        })
        .catch(err => {
          done();
        });
    });

    it('should return the result of hash', done => {
      sinon.stub(bcrypt, 'genSalt').callsFake((salt, cb) => cb(null, 'salt'));
      sinon.stub(bcrypt, 'hash').callsFake((password, salt, cb) => cb(null, 'hash'));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.encrypt('test')
        .then(hash => {
          expect(hash).to.eq('hash');
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  // compare
  describe('compare', () => {
    it('should call compare', done => {
      const compareStub = sinon.stub(bcrypt, 'compare').callsFake((password, encrypted, cb) => cb(null, true));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.compare('test', 'test')
        .then(() => {
          expect(compareStub.callCount).to.eq(1);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should return true result of compare', done => {
      sinon.stub(bcrypt, 'compare').callsFake((password, encrypted, cb) => cb(null, true));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.compare('test', 'test')
        .then(success => {
          expect(success).to.eq(true);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should return false result of compare', done => {
      sinon.stub(bcrypt, 'compare').callsFake((password, encrypted, cb) => cb(null, false));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.compare('test', 'test')
        .then(success => {
          expect(success).to.eq(false);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('should reject on error', done => {
      sinon.stub(bcrypt, 'compare').callsFake((password, encrypted, cb) => cb('Failed to compare passwords', false));

      const bcryptPasswordService = new BCryptPasswordService();
      bcryptPasswordService.compare('test', 'test')
        .then(success => {
          done('Called then on error');
        })
        .catch(err => {
          done();
        });
    });
  });
});
