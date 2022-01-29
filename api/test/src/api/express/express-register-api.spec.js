const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const ExpressAPI = require('../../../../src/api/express/express-api');
const ExpressRegisterAPI = require('../../../../src/api/express/express-register-api');

const expect = chai.expect;

describe('ExpressRegisterAPI class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of ExpressAPI', () => {
    const registerAPI = new ExpressRegisterAPI();

    expect(() => new ExpressRegisterAPI()).to.not.throw();
    expect(registerAPI instanceof ExpressAPI).to.eq(true);
  });

  it('should store user service', () => {
    const registerAPI = new ExpressRegisterAPI(1, 2);

    expect(registerAPI.userService).to.eq(2);
  });

  it('should register a POST route for root', () => {
    const spy = sinon.spy();
    const stub = sinon.stub().returns({
      post: spy
    });
    sinon.replace(express, 'Router', stub);

    new ExpressRegisterAPI();

    expect(stub.callCount).to.eq(1);
    expect(spy.callCount).to.eq(1);
    expect(spy.args[0][0]).to.eq('/');
  });

  // register
  describe('register', () => {
    describe('success', () => {
      let registerStub;
      let logSpy;
      let expressRegisterAPI;
      let req;

      beforeEach(() => {
        registerStub = sinon.stub().resolves('token');
        logSpy = sinon.spy();
        expressRegisterAPI = new ExpressRegisterAPI({
          error: logSpy
        }, {
          register: registerStub
        });
        req = {
          body: {
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'email',
            password: 'password',
            confirmPassword: 'confirmpassword'
          }
        };
      });

      it('should call registration if validation passed', done => {
        const sendStub = sinon.stub().callsFake(() => {
          expect(registerStub.callCount).to.eq(1);
          expect(registerStub.args[0][0]).to.eq('firstname');
          expect(registerStub.args[0][1]).to.eq('lastname');
          expect(registerStub.args[0][2]).to.eq('email');
          expect(registerStub.args[0][3]).to.eq('password');
          done();
        });
        const res = {
          send: sendStub
        };

        expressRegisterAPI
          .register(req, res);
      });

      it('should send a token if registration passes', done => {
        const sendStub = sinon.stub().callsFake(() => {
          expect(sendStub.callCount).to.eq(1);
          expect(sendStub.args[0][0].token).to.eq('token');
          done();
        });
        const res = {
          send: sendStub
        };

        expressRegisterAPI
          .register(req, res);
      });
    });

    describe('failed to validate', () => {
      let registerStub;
      let logSpy;
      let expressRegisterAPI;
      let req;

      beforeEach(() => {
        registerStub = sinon.stub().resolves('token');
        logSpy = sinon.spy();
        expressRegisterAPI = new ExpressRegisterAPI({
          error: logSpy
        }, {
          register: registerStub
        });
        req = {
          body: {
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'email',
            password: 'password',
            confirmPassword: 'confirmpassword'
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

        expressRegisterAPI
          .register(req, res);
      });

      it('should return 400 if validation failed', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(sendStatusStub.callCount).to.eq(1);
          expect(sendStatusStub.args[0][0]).to.eq(400);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressRegisterAPI
          .register(req, res);
      });
    });

    describe('failed to register', () => {
      let registerStub;
      let logSpy;
      let expressRegisterAPI;
      let req;

      beforeEach(() => {
        registerStub = sinon.stub().rejects('');
        logSpy = sinon.spy();
        expressRegisterAPI = new ExpressRegisterAPI({
          error: logSpy
        }, {
          register: registerStub
        });
        req = {
          body: {
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'email',
            password: 'password',
            confirmPassword: 'confirmpassword'
          }
        };
      });

      it('should log if register fails', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(logSpy.callCount).to.eq(1);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressRegisterAPI
          .register(req, res);
      });

      it('should return 400 if register fails', done => {
        const sendStatusStub = sinon.stub().callsFake(() => {
          expect(sendStatusStub.callCount).to.eq(1);
          expect(sendStatusStub.args[0][0]).to.eq(400);
          done();
        });
        const res = {
          sendStatus: sendStatusStub
        };

        expressRegisterAPI
          .register(req, res);
      });
    });

    describe('exception', () => {
      let logSpy;
      let expressRegisterAPI;
      let sendStatusSpy;
      let res;

      beforeEach(() => {
        registerStub = sinon.stub().resolves('');
        logSpy = sinon.spy();
        expressRegisterAPI = new ExpressRegisterAPI({
          error: logSpy
        }, {
          register: registerStub
        });
        sendStatusSpy = sinon.spy();
        res = {
          sendStatus: sendStatusSpy
        };
      });

      it('should send 400 if an exception is thrown', () => {
        expressRegisterAPI = new ExpressRegisterAPI();

        expressRegisterAPI.register(undefined, res);

        expect(sendStatusSpy.callCount).to.eq(1);
        expect(sendStatusSpy.args[0][0]).to.eq(400);
      });
    });
  });
});
