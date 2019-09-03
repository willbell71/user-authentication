const chai = require('chai');
const sinon = require('sinon');

const LogLine = require('../../../../src/services/logger/log-line');

const expect = chai.expect;

describe('LogLine class', () => {
  afterEach(() => sinon.restore());

  it('should create a log line instance', () => {
    expect(() => new LogLine()).to.not.throw();
  });

  describe('log', () => {
    it('should call console.log', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLine();

      logger.log();

      expect(spy.callCount).to.equal(1);
    });

    it('should output the date', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLine();

      const dateString = new Date().toISOString();
      logger.log(dateString);

      expect(spy.args[0].toString().includes(dateString)).to.equal(true);
    });

    it('should output the pid', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLine();

      const pid = '123456';
      logger.log('', pid);

      expect(spy.args[0].toString().includes(pid)).to.equal(true);
    });

    it('should output the message', () => {
      const spy = sinon.spy();
      sinon.replace(console, 'log', spy);

      const logger = new LogLine();

      const message = '--message--';
      logger.log('', '', message);

      expect(spy.args[0].toString().includes(message)).to.equal(true);
    });
  });
});
