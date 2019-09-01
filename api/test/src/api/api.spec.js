const chai = require('chai');
const sinon = require('sinon');

const API = require('../../../src/api/api');

const expect = chai.expect;

describe('API class', () => {
  afterEach(() => sinon.restore());

  it('creates an API instance', () => {
    expect(() => new API()).to.not.throw();
  });
});
