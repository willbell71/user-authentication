const chai = require('chai');
const sinon = require('sinon');

const LogLineConsoleWarn = require('../../logger/log-line-console-warn');
const LogLine = require('../../logger/log-line');

const expect = chai.expect;

describe('LogLineConsoleWarn class', () => {
  afterEach(() => sinon.restore());

  it('should be an instance of LogLine', () => {
    const logger = new LogLineConsoleWarn();
    expect(logger instanceof LogLine).to.eq(true);
  });

  describe('log', () => {
    it('should call console.warn', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'warn', spy);

      const logger = new LogLineConsoleWarn();

      logger.log();

      expect(spy.callCount).to.equal(1);
    });

    it('should output the date', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'warn', spy);

      const logger = new LogLineConsoleWarn();

      const dateString = new Date().toISOString();
      logger.log(dateString);

      expect(spy.args[0].toString().includes(dateString)).to.equal(true);
    });

    it('should output the pid', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'warn', spy);

      const logger = new LogLineConsoleWarn();

      const pid = '123456';
      logger.log('', pid);

      expect(spy.args[0].toString().includes(pid)).to.equal(true);
    });

    it('should output the message', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'warn', spy);

      const logger = new LogLineConsoleWarn();

      const message = '--message--';
      logger.log('', '', message);

      expect(spy.args[0].toString().includes(message)).to.equal(true);
    });
  });
});
