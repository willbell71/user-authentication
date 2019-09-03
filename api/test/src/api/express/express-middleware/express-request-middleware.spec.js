const chai = require('chai');
const sinon = require('sinon');

const ExpressRequestMiddleware = require('../../../../../src/api/express/express-middleware/express-request-middleware');

const expect = chai.expect;

describe('ExpressRequestMiddleware class', () => {
  afterEach(() => sinon.restore());

  let debugLogSpy;
  let logger;
  let req;
  let sendStatusSpy;
  let res;
  let nextSpy;

  beforeEach(() => {
    debugLogSpy = sinon.spy();
    logger = {
      debug: debugLogSpy
    };
    req = {
      body: {
        first: '',
        second: ''
      }
    };
    sendStatusSpy = sinon.spy();
    res = {
      sendStatus: sendStatusSpy
    };
    nextSpy = sinon.spy();
  });

  it('should log', () => {
    ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, nextSpy, ['first', 'second']);

    expect(debugLogSpy.callCount).to.eq(2);
  });

  it('should call next if validation passes', () => {
    ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, nextSpy, ['first', 'second']);

    expect(nextSpy.callCount).to.eq(1);
  });

  it('should send 400 if validation fails', () => {
    ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, nextSpy, ['first']);

    expect(sendStatusSpy.callCount).to.eq(1);
    expect(sendStatusSpy.args[0][0]).to.eq(400);
  });

  it('should be able to handle mixed case filters', () => {
    ExpressRequestMiddleware.validateRequestBodyFields(logger, req, res, nextSpy, ['First', 'seCond']);

    expect(nextSpy.callCount).to.eq(1);
  });

  it('should send 400 if exception thrown', () => {
    ExpressRequestMiddleware.validateRequestBodyFields(undefined, undefined, res);

    expect(sendStatusSpy.callCount).to.eq(1);
    expect(sendStatusSpy.args[0][0]).to.eq(400);
  });
});
