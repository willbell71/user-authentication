const chai = require('chai');
const sinon = require('sinon');

const LogLineConsoleLog = require('../../../../src/services/logger/log-line-console-log');
const LogLine = require('../../../../src/services/logger/log-line');

const expect = chai.expect;

describe('LogLineConsoleLog class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of LogLine', () => {
    const logger = new LogLineConsoleLog();

    expect(() => new LogLineConsoleLog()).to.not.throw();
    expect(logger instanceof LogLine).to.eq(true);
  });

  describe('log', () => {
    it('should call console.log', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLineConsoleLog();

      logger.log();

      expect(spy.callCount).to.equal(1);
    });

    it('should output the date', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLineConsoleLog();

      const dateString = new Date().toISOString();
      logger.log(dateString);

      expect(spy.args[0].toString().includes(dateString)).to.equal(true);
    });

    it('should output the pid', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLineConsoleLog();

      const pid = '123456';
      logger.log('', pid);

      expect(spy.args[0].toString().includes(pid)).to.equal(true);
    });

    it('should output the message', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLineConsoleLog();

      const message = '--message--';
      logger.log('', '', message);

      expect(spy.args[0].toString().includes(message)).to.equal(true);
    });
  });
});
