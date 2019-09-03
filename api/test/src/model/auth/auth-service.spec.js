const chai = require('chai');
const sinon = require('sinon');

const AuthService = require('../../../../src/model/auth/auth-service');

const expect = chai.expect;

describe('AuthService class', () => {
  afterEach(() => sinon.restore());

  it('should store logger service', () => {
    const authService = new AuthService(1, 2, 3);

    expect(authService.loggerService).to.eq(1);
  });

  it('should store token service', () => {
    const authService = new AuthService(1, 2, 3);

    expect(authService.tokenService).to.eq(2);
  });

  it('should store db service', () => {
    const authService = new AuthService(1, 2, 3);

    expect(authService.dbService).to.eq(3);
  });

  describe('getAuthenticatedUserForToken', () => {
    let loggerService;
    let decryptStub;
    let tokenService;
    let fetchStub;
    let getPropStub;
    let setPropSpy;
    let saveStub;
    let dbService;

    beforeEach(() => {
      loggerService = {};
      decryptStub = sinon.stub().resolves({id: 'user'});
      tokenService = {
        decrypt: decryptStub
      };
      fetchStub = sinon.stub().resolves({id: 'user'});
      getPropStub = sinon.stub()
        .onFirstCall().returns('token')
        .onSecondCall().returns(new Date());
      setPropSpy = sinon.spy();
      saveStub = sinon.stub().resolves('');
      dbService = {
        fetch: fetchStub,
        getProp: getPropStub,
        setProp: setPropSpy,
        save: saveStub
      };
    });

    it('should call decrypt for token', done => {
      const authService = new AuthService(loggerService, tokenService, dbService);

      authService.getAuthenticatedUserForToken('token')
        .then(user => {
          expect(decryptStub.callCount).to.eq(1);
          expect(decryptStub.args[0][0]).to.eq('token');
          done();
        })
        .catch(() => done('Invoked catch'));
    });

    it('should fetch user for id in token', done => {
      const authService = new AuthService(loggerService, tokenService, dbService);

      authService.getAuthenticatedUserForToken('token')
        .then(user => {
          expect(fetchStub.callCount).to.eq(1);
          expect(fetchStub.args[0][0]).to.eq('User');
          expect(fetchStub.args[0][1]).to.eq('id');
          expect(fetchStub.args[0][2]).to.eq('user');
          done();
        })
        .catch(() => done('Invoked catch'));
    });

    it('should get token from fetched user', done => {
      const authService = new AuthService(loggerService, tokenService, dbService);

      authService.getAuthenticatedUserForToken('token')
        .then(user => {
          expect(getPropStub.callCount).to.eq(2);
          expect(getPropStub.args[0][1]).to.eq('token');
          done();
        })
        .catch(() => done('Invoked catch'));
    });

    it('should get user last login if tokens match', done => {
      const authService = new AuthService(loggerService, tokenService, dbService);

      authService.getAuthenticatedUserForToken('token')
        .then(user => {
          expect(getPropStub.callCount).to.eq(2);
          expect(getPropStub.args[1][1]).to.eq('lastLogin');
          done();
        })
        .catch(() => done('Invoked catch'));
    });

    it('should return user if token matches and still alive', done => {
      const authService = new AuthService(loggerService, tokenService, dbService);

      authService.getAuthenticatedUserForToken('token')
        .then(user => {
          expect(user.id).to.eq('user');
          done();
        })
        .catch(() => done('Invoked catch'));
    });

    describe('expired token', () => {
      let loggerService;
      let decryptStub;
      let tokenService;
      let fetchStub;
      let getPropStub;
      let setPropSpy;
      let saveStub;
      let dbService;

      beforeEach(() => {
        loggerService = {};
        decryptStub = sinon.stub().resolves({id: 'user'});
        tokenService = {
          decrypt: decryptStub
        };
        fetchStub = sinon.stub().resolves('');
        getPropStub = sinon.stub()
          .onFirstCall().returns('token')
          .onSecondCall().returns(new Date(1));
        setPropSpy = sinon.spy();
        saveStub = sinon.stub().resolves('');
        dbService = {
          fetch: fetchStub,
          getProp: getPropStub,
          setProp: setPropSpy,
          save: saveStub
        };
      });

      it('should clear token if token expired', done => {
        const authService = new AuthService(loggerService, tokenService, dbService);

        authService.getAuthenticatedUserForToken('token')
          .then(() => done('Invoked then block'))
          .catch(() => {
            expect(setPropSpy.callCount).to.eq(1);
            expect(setPropSpy.args[0][1]).to.eq('token');
            expect(setPropSpy.args[0][2]).to.eq(undefined);
            done();
          });
      });

      it('should write user to db if token expired', done => {
        const authService = new AuthService(loggerService, tokenService, dbService);

        authService.getAuthenticatedUserForToken('token')
          .then(() => done('Invoked then block'))
          .catch(() => {
            expect(saveStub.callCount).to.eq(1);
            done();
          });
      });

      it('should throw error if token expired', done => {
        const authService = new AuthService(loggerService, tokenService, dbService);

        authService.getAuthenticatedUserForToken('token')
          .then(() => done('Invoked then block'))
          .catch(() => done());
      });
    });

    describe('bad token', () => {
      let loggerService;
      let decryptStub;
      let tokenService;
      let fetchStub;
      let getPropStub;
      let setPropSpy;
      let saveStub;
      let dbService;

      beforeEach(() => {
        loggerService = {};
        decryptStub = sinon.stub().resolves({id: 'user'});
        tokenService = {
          decrypt: decryptStub
        };
        fetchStub = sinon.stub().resolves('');
        getPropStub = sinon.stub()
          .onFirstCall().returns('token')
          .onSecondCall().returns(new Date(1));
        setPropSpy = sinon.spy();
        saveStub = sinon.stub().resolves('');
        dbService = {
          fetch: fetchStub,
          getProp: getPropStub,
          setProp: setPropSpy,
          save: saveStub
        };
      });

      it('should throw if tokens dont match', done => {
        const authService = new AuthService(loggerService, tokenService, dbService);

        authService.getAuthenticatedUserForToken('bad')
          .then(() => done('Invoked then block'))
          .catch(() => done());
      });
    });
  });
});
