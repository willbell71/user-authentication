const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const ExpressAPI = require('../../../src/express-api/express-api');
const ExpressTestAPI = require('../../../src/express-api/express-test-api');

const expect = chai.expect;

describe('ExpressTestAPI class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of ExpressAPI', () => {
    const testAPI = new ExpressTestAPI();

    expect(() => new ExpressTestAPI()).to.not.throw();
    expect(testAPI instanceof ExpressAPI).to.eq(true);
  });

  it('should register a GET route for root', () => {
    const spy = sinon.spy();
    const stub = sinon.stub().returns({
      get: spy
    });
    sinon.replace(express, 'Router', stub);

    new ExpressTestAPI();

    expect(stub.callCount).to.eq(1);
    expect(spy.callCount).to.eq(1);
    expect(spy.args[0][0]).to.eq('/');
    expect(typeof spy.args[0][1]).to.eq('function');
  });

  describe('test', () => {
    it('should respond with a 200 status for root GET request', () => {
      const spy = sinon.spy();

      const testAPI = new ExpressTestAPI();

      testAPI.test(undefined, {
        sendStatus: spy
      });

      expect(spy.callCount).to.eq(1);
      expect(spy.args[0].toString()).to.eq('200');
    });
  });
});
