const chai = require('chai');
const sinon = require('sinon');

const express = require('express');

const API = require('../../../../src/api/api');
const ExpressAPI = require('../../../../src/api/express/express-api');

const expect = chai.expect;

describe('ExpressAPI class', () => {
  afterEach(() => sinon.restore());

  it('creates an express router instance', () => {
    const spy = sinon.spy();
    sinon.replace(express, 'Router', spy);

    expect(() => new ExpressAPI()).to.not.throw();
    expect(spy.callCount).to.eq(1);
  });

  it('should be an instance of API', () => {
    expect(new ExpressAPI() instanceof API).to.eq(true);
  });
});
