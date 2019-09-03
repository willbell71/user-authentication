const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const ExpressAPI = require('../../../../src/api/express/express-api');
const ExpressGetSomethingAPI = require('../../../../src/api/express/express-get-something-api');

const expect = chai.expect;

describe('ExpressGetSomethingAPI class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of ExpressAPI', () => {
    const getSomethingAPI = new ExpressGetSomethingAPI();

    expect(() => new ExpressGetSomethingAPI()).to.not.throw();
    expect(getSomethingAPI instanceof ExpressAPI).to.eq(true);
  });

  it('should store auth service', () => {
    const getSomethingAPI = new ExpressGetSomethingAPI(1, 2);

    expect(getSomethingAPI.authService).to.eq(2);
  });

  it('should register a GET route for root', () => {
    const spy = sinon.spy();
    const stub = sinon.stub().returns({
      get: spy
    });
    sinon.replace(express, 'Router', stub);

    new ExpressGetSomethingAPI();

    expect(stub.callCount).to.eq(1);
    expect(spy.callCount).to.eq(1);
    expect(spy.args[0][0]).to.eq('/');
  });

  describe('getSomething', () => {
    it('should send a response', () => {
      const getSomethingAPI = new ExpressGetSomethingAPI();
      const sendSpy = sinon.spy();
      const res = {
        send: sendSpy
      };

      getSomethingAPI.getSomething(undefined, res);

      expect(sendSpy.callCount).to.eq(1);
    });

    it('should return 400 for an exception', () => {
      const getSomethingAPI = new ExpressGetSomethingAPI();
      const sendStatusSpy = sinon.spy();
      const res = {
        sendStatus: sendStatusSpy
      };

      getSomethingAPI.getSomething(undefined, res);

      expect(sendStatusSpy.callCount).to.eq(1);
      expect(sendStatusSpy.args[0][0]).to.eq(400);
    });
  });
});
