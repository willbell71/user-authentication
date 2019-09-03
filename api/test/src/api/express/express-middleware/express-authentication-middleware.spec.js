const chai = require('chai');
const sinon = require('sinon');

const ExpressAuthenticationMiddleware = require('../../../../../src/api/express/express-middleware/express-authentication-middleware');

const expect = chai.expect;

describe('ExpressAuthenticationMiddleware class', () => {
  afterEach(() => sinon.restore());

  describe('no auth header', () => {
    let debugLogSpy;
    let errorLogSpy;
    let logger;
    let req;
    let sendStatusSpy;
    let res;
    let next;
    let authStub;
    let authService;

    beforeEach(() => {
      debugLogSpy = sinon.spy();
      errorLogSpy = sinon.spy();
      logger = {
        debug: debugLogSpy,
        error: errorLogSpy
      };

      req = {
        headers: {},
        user: {}
      };

      sendStatusSpy = sinon.spy();
      res = {
        sendStatus: sendStatusSpy
      };

      next = sinon.spy();

      authStub = sinon.stub().resolves('');
      authService = {
        getAuthenticatedUserForToken: authStub
      };
    });

    it('should log if no auth header', () => {
      ExpressAuthenticationMiddleware.auth(logger, req, res, next, authService);

      expect(debugLogSpy.callCount).to.eq(1);
    });

    it('should return 401 if no auth header', () => {
      ExpressAuthenticationMiddleware.auth(logger, req, res, next, authService);

      expect(sendStatusSpy.callCount).to.eq(1);
      expect(sendStatusSpy.args[0][0]).to.eq(401);
    });
  });

  describe('success', () => {
    let debugLogSpy;
    let errorLogSpy;
    let logger;
    let req;
    let sendStatusSpy;
    let res;
    let authStub;
    let authService;

    beforeEach(() => {
      debugLogSpy = sinon.spy();
      errorLogSpy = sinon.spy();
      logger = {
        debug: debugLogSpy,
        error: errorLogSpy
      };

      req = {
        headers: {
          authorization: 'Bearer token'
        },
        user: {}
      };

      sendStatusSpy = sinon.spy();
      res = {
        sendStatus: sendStatusSpy
      };

      authStub = sinon.stub().resolves('user');
      authService = {
        getAuthenticatedUserForToken: authStub
      };
    });

    it('should call auth service with token', done => {
      const nextStub = sinon.stub().callsFake(() => {
        expect(authStub.callCount).to.eq(1);
        expect(authStub.args[0][0]).to.eq('token');
        done();
      });

      ExpressAuthenticationMiddleware.auth(logger, req, res, nextStub, authService);
    });

    it('should add user to request if auth passes', done => {
      const nextStub = sinon.stub().callsFake(() => {
        expect(req.user).to.eq('user');
        done();
      });

      ExpressAuthenticationMiddleware.auth(logger, req, res, nextStub, authService);
    });

    it('should log if auth passes', done => {
      const nextStub = sinon.stub().callsFake(() => {
        expect(debugLogSpy.callCount).to.eq(1);
        done();
      });

      ExpressAuthenticationMiddleware.auth(logger, req, res, nextStub, authService);
    });

    it('should call next if auth passes', done => {
      const nextStub = sinon.stub().callsFake(() => {
        expect(nextStub.callCount).to.eq(1);
        done();
      });

      ExpressAuthenticationMiddleware.auth(logger, req, res, nextStub, authService);
    });
  });

  describe('failed to auth', () => {
    let debugLogSpy;
    let errorLogSpy;
    let logger;
    let req;
    let authStub;
    let authService;

    beforeEach(() => {
      debugLogSpy = sinon.spy();
      errorLogSpy = sinon.spy();
      logger = {
        debug: debugLogSpy,
        error: errorLogSpy
      };

      req = {
        headers: {
          authorization: 'Bearer token'
        },
        user: {}
      };

      authStub = sinon.stub().rejects('');
      authService = {
        getAuthenticatedUserForToken: authStub
      };
    });

    it('should log if auth fails', done => {
      const sendStatusStub = sinon.stub().callsFake(() => {
        expect(errorLogSpy.callCount).to.eq(1);
        done();
      });

      res = {
        sendStatus: sendStatusStub
      };

      ExpressAuthenticationMiddleware.auth(logger, req, res, () => {}, authService);
    });

    it('should send 401 if auth fails', done => {
      const sendStatusStub = sinon.stub().callsFake(() => {
        expect(sendStatusStub.callCount).to.eq(1);
        expect(sendStatusStub.args[0][0]).to.eq(401);
        done();
      });

      res = {
        sendStatus: sendStatusStub
      };

      ExpressAuthenticationMiddleware.auth(logger, req, res, () => {}, authService);
    });
  });

  describe('exception', () => {
    it('should send 400 if an exception is thrown', () => {
      const sendStatusSpy = sinon.spy();
      res = {
        sendStatus: sendStatusSpy
      };

      ExpressAuthenticationMiddleware.auth(undefined, undefined, res, undefined, undefined);

      expect(sendStatusSpy.callCount).to.eq(1);
      expect(sendStatusSpy.args[0][0]).to.eq(400);
    });
  });
});
