const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const ExpressAPI = require('../../../src/express-api/express-api');

const expect = chai.expect;

describe('ExpressAPI class', () => {
  afterEach(() => sinon.restore());

  it('creates an express router instance', () => {
    const spy = sinon.spy();
    sinon.replace(express, 'Router', spy);

    expect(() => new ExpressAPI()).to.not.throw();
    expect(spy.callCount).to.eq(1);
  });
});
