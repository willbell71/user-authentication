const http = require('http');

const chai = require('chai');
const sinon = require('sinon');

const Server = require('../../../src/server/server');
const ExpressServer = require('../../../src/server/express-server');

const expect = chai.expect;

describe('ExpressServer class', () => {
  afterEach(() => sinon.restore());

  it('should create an instance', () => {
    sinon.replace(process, 'env', {
      LOGINAPI_USE_COMPRESSION: 'true',
      LOGINAPI_DISABLE_CORS: 'true'
    });

    expect(() => new ExpressServer({info: () => {}}, [{path: '/', controller: {router: () => {}}}])).to.not.throw();
    expect(new ExpressServer({info: () => {}}) instanceof Server).to.eq(true);
  });

  describe('start', () => {
    it('creates and starts a http server', () => {
      const spy = sinon.spy();
      const stub = sinon.stub().returns({
        listen: spy
      });
      sinon.replace(http, 'createServer', stub);

      const server = new ExpressServer();
      server.start();

      expect(stub.callCount).to.eq(1);
      expect(spy.callCount).to.eq(1);
    });

    it('server logs on start', () => {
      const spy = sinon.spy();
      const stub = sinon.stub().returns({
        listen: (_, cb) => cb()
      });
      sinon.replace(http, 'createServer', stub);

      const server = new ExpressServer({
        info: spy
      });
      server.start();

      expect(spy.callCount).to.eq(1);
    });
  });
});
