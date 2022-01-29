const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const ExpressAPI = require('../../../../src/api/express/express-api');
const ExpressLoginAPI = require('../../../../src/api/express/express-login-api');

const expect = chai.expect;

describe('ExpressLoginAPI class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of ExpressAPI', () => {
    const loginAPI = new ExpressLoginAPI();

    expect(() => new ExpressLoginAPI()).to.not.throw();
    expect(loginAPI instanceof ExpressAPI).to.eq(true);
  });

  it('should store user service', () => {
    const expressLoginAPI = new ExpressLoginAPI(1, 2);

    expect(expressLoginAPI.userService).to.eq(2);
  });

  it('should register a POST route for root', () => {
    const spy = sinon.spy();
    const stub = sinon.stub().returns({
      post: spy
    });
    sinon.replace(express, 'Router', stub);

    new ExpressLoginAPI();

    expect(stub.callCount).to.eq(1);
    expect(spy.callCount).to.eq(1);
    expect(spy.args[0][0]).to.eq('/');
  });

  describe('login', () => {
    describe('success', () => {
      let loginStub;
      let logSpy;
      let expressLoginAPI;
      let req;

      beforeEach(() => {
        loginStub = sinon.stub().resolves('token');
        logSpy = sinon.spy();
        expressLoginAPI = new ExpressLoginAPI({
          error: logSpy
        }, {
          login: loginStub
        });
        req = {
          body: {
            email: 'email',
            password: 'password'
          }
        };
      });

      it('should call login if validation passed', done => {
        const sendStub = sinon.stub().callsFake(() => {
          expect(loginStub.callCount).to.eq(1);
          expect(loginStub.args[0][0]).to.eq('email');
          expect(loginStub.args[0][1]).to.eq('password');
          done();
        });
        const res = {
          send: sendStub
        };

        expressLoginAPI
          .login(req, res);
      });

      it('should send a token if login passes', done => {
        const sendStub = sinon.stub().callsFake(() => {
          expect(sendStub.callCount).to.eq(1);
          expect(sendStub.args[0][0].token).to.eq('token');
          done();
        });
        const res = {
          send: sendStub
        };

        expressLoginAPI
          .login(req, res);
      });
    });

    describe('failed to validate', () => {
      let loginStub;
      let logSpy;
      let expressLoginAPI;
      let req;

      beforeEach(() => {
        loginStub = sinon.stub().resolves('token');
        logSpy = sinon.spy();
        expressLoginAPI = new ExpressLoginAPI({
          error: logSpy
        }, {
          login: loginStub
        });
        req = {
          body: {
            email: 'email',
            password: 'password'
          }
        };
      });

      it('should log if validation failed', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(logSpy.callCount).to.eq(1);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLoginAPI
          .login(req, res);
      });
    });

    describe('failed to login', () => {
      let loginStub;
      let logSpy;
      let expressLoginAPI;
      let req;

      beforeEach(() => {
        loginStub = sinon.stub().rejects('');
        logSpy = sinon.spy();
        expressLoginAPI = new ExpressLoginAPI({
          error: logSpy
        }, {
          login: loginStub
        });
        req = {
          body: {
            email: 'email',
            password: 'password'
          }
        };
      });

      it('should log if login fails', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(logSpy.callCount).to.eq(1);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLoginAPI
          .login(req, res);
      });

      it('should return 401 if login fails', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(sendStatusStub.callCount).to.eq(1);
          expect(sendStatusStub.args[0][0]).to.eq(401);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLoginAPI
          .login(req, res);
      });
    });

    describe('exception', () => {
      let loginStub;
      let logSpy;
      let expressLoginAPI;
      let sendStatusSpy;
      let res;

      beforeEach(() => {
        loginStub = sinon.stub().resolves('');
        logSpy = sinon.spy();
        expressLoginAPI = new ExpressLoginAPI({
          error: logSpy
        }, {
          login: loginStub
        });
        sendStatusSpy = sinon.spy();
        res = {
          sendStatus: sendStatusSpy
        };
      });

      it('should send 400 if an exception is thrown', () => {
        expressLoginAPI = new ExpressLoginAPI();

        expressLoginAPI.login(undefined, res);

        expect(sendStatusSpy.callCount).to.eq(1);
        expect(sendStatusSpy.args[0][0]).to.eq(400);
      });
    });
  });
});
