const chai = require('chai');
const sinon = require('sinon');

const ServerFactory = require('../../../src/server/server-factory');
const Server = require('../../../src/server/server');
const ExpressServer = require('../../../src/server/express-server');

const expect = chai.expect;

describe('ExpressServer class', () => {
  afterEach(() => sinon.restore());

  it('should return an express instance', () => {
    const spy = sinon.spy();
    Object.setPrototypeOf(ExpressServer, spy);

    const server = ServerFactory.createServer('express');

    expect(spy.callCount).to.eq(1);
    expect(server instanceof Server).to.eq(true);
    expect(server instanceof ExpressServer).to.eq(true);
  });

  it('should throw an error for an unknown server type', () => {
    const spy = sinon.spy();

    const logger = {
      error: spy
    };

    expect(() => ServerFactory.createServer('', logger)).to.throw(Error);
    expect(spy.callCount).to.eq(1);
  });
});
