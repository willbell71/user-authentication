const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const ExpressAPI = require('../../../../src/api/express/express-api');
const ExpressLogOutAPI = require('../../../../src/api/express/express-logout-api');

const expect = chai.expect;

describe('ExpressLogOutAPI class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of ExpressAPI', () => {
    const logoutAPI = new ExpressLogOutAPI();

    expect(() => new ExpressLogOutAPI()).to.not.throw();
    expect(logoutAPI instanceof ExpressAPI).to.eq(true);
  });

  it('should store auth service', () => {
    const expressLogOutAPI = new ExpressLogOutAPI(1, 2, 3);

    expect(expressLogOutAPI.authService).to.eq(2);
  });

  it('should store user service', () => {
    const expressLogOutAPI = new ExpressLogOutAPI(1, 2, 3);

    expect(expressLogOutAPI.userService).to.eq(3);
  });

  it('should register a GET route for root', () => {
    const spy = sinon.spy();
    const stub = sinon.stub().returns({
      get: spy
    });
    sinon.replace(express, 'Router', stub);

    new ExpressLogOutAPI();

    expect(stub.callCount).to.eq(1);
    expect(spy.callCount).to.eq(1);
    expect(spy.args[0][0]).to.eq('/');
  });

  describe('logout', () => {
    describe('success', () => {
      let logOutStub;
      let logSpy;
      let expressLogOutAPI;
      let req;

      beforeEach(() => {
        logOutStub = sinon.stub().resolves('');
        logSpy = sinon.spy();
        expressLogOutAPI = new ExpressLogOutAPI({
          error: logSpy
        }, undefined, {
          logout: logOutStub
        });
        req = {
          user: 5
        };
      });

      it('should call logout', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(logOutStub.callCount).to.eq(1);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLogOutAPI
          .logout(req, res);
      });

      it('should return 200 if logout works', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(sendStatusStub.callCount).to.eq(1);
          expect(sendStatusStub.args[0][0]).to.eq(200);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLogOutAPI
          .logout(req, res);
      });
    });

    describe('failure', () => {
      let logOutStub;
      let logSpy;
      let expressLogOutAPI;
      let req;

      beforeEach(() => {
        logOutStub = sinon.stub().rejects('');
        logSpy = sinon.spy();
        expressLogOutAPI = new ExpressLogOutAPI({
          error: logSpy
        }, undefined, {
          logout: logOutStub
        });
        req = {
          user: 5
        };
      });

      it('should log if logout fails', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(logSpy.callCount).to.eq(1);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLogOutAPI
          .logout(req, res);
      });

      it('should send 400 if logout fails', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(sendStatusStub.callCount).to.eq(1);
          expect(sendStatusStub.args[0][0]).to.eq(400);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressLogOutAPI
          .logout(req, res);
      });
    });

    describe('exception', () => {
      let logOutStub;
      let logSpy;
      let expressLogOutAPI;
      let sendStatusSpy;
      let res;

      beforeEach(() => {
        logOutStub = sinon.stub().resolves('');
        logSpy = sinon.spy();
        expressLogOutAPI = new ExpressLogOutAPI({
          error: logSpy
        }, undefined, {
          logout: logOutStub
        });
        sendStatusSpy = sinon.spy();
        res = {
          sendStatus: sendStatusSpy
        };
      });

      it('should send 400 if an exception is thrown', () => {
        expressLogOutAPI = new ExpressLogOutAPI();

        expressLogOutAPI.logout(undefined, res);

        expect(sendStatusSpy.callCount).to.eq(1);
        expect(sendStatusSpy.args[0][0]).to.eq(400);
      });
    });
  });
});
