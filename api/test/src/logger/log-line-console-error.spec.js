const chai = require('chai');
const sinon = require('sinon');

const LogLineConsoleError = require('../../../src/logger/log-line-console-error');
const LogLine = require('../../../src/logger/log-line');

const expect = chai.expect;

describe('LogLineConsoleError class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of LogLine', () => {
    const logger = new LogLineConsoleError();

    expect(() => new LogLineConsoleError()).to.not.throw();
    expect(logger instanceof LogLine).to.eq(true);
  });

  describe('log', () => {
    it('should call console.error', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'error', spy);

      const logger = new LogLineConsoleError();

      logger.log();

      expect(spy.callCount).to.equal(1);
    });

    it('should output the date', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'error', spy);

      const logger = new LogLineConsoleError();

      const dateString = new Date().toISOString();
      logger.log(dateString);

      expect(spy.args[0].toString().includes(dateString)).to.equal(true);
    });

    it('should output the pid', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'error', spy);

      const logger = new LogLineConsoleError();

      const pid = '123456';
      logger.log('', pid);

      expect(spy.args[0].toString().includes(pid)).to.equal(true);
    });

    it('should output the message', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'error', spy);

      const logger = new LogLineConsoleError();

      const message = '--message--';
      logger.log('', '', message);

      expect(spy.args[0].toString().includes(message)).to.equal(true);
    });
  });
});
