const http = require('http');

const chai = require('chai');
const sinon = require('sinon');

const Server = require('../../../src/server/server');

const expect = chai.expect;

describe('ExpressServer class', () => {
  afterEach(() => sinon.restore());

  it('should create an instance', () => {
    expect(() => new Server()).to.not.throw();
  });

  it('should start', () => {
    const server = new Server();

    expect(() => server.start()).to.not.throw();
  });
});
