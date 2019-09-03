const chai = require('chai');
const sinon = require('sinon');
const {Writable} = require('stream');

const Logger = require('../../../../src/services/logger/logger');

const expect = chai.expect;

describe('Logger class', () => {
  afterEach(() => sinon.restore());

  it('should return an instance of Writable', () => {
    const logger = new Logger();

    expect(() => new Logger()).to.not.throw();
    expect(logger instanceof Writable).to.eq(true);
  });

  it('should call logger verbose in response to stream write', () => {
    const logger = new Logger();

    const spy = sinon.spy();
    logger.verbose = spy;

    logger.write('', () => {});

    expect(spy.callCount).to.eq(1);
  });

  it('should initialise logger level to ALL', () => {
    const logger = new Logger();

    expect(logger.loggerLevel).to.eq(100);
  });

  it('should store loggers passed, in an array', () => {
    const loggerA = {};
    const loggerB = {};
    const loggerC = {};
    const loggerD = {};
    const logger = new Logger(loggerA, loggerB, loggerC, loggerD);

    expect(Array.isArray(logger.loggers.log)).to.eq(true);
    expect(logger.loggers.log.length).to.eq(1);
    expect(logger.loggers.log[0]).to.eq(loggerA);

    expect(Array.isArray(logger.loggers.warn)).to.eq(true);
    expect(logger.loggers.warn.length).to.eq(1);
    expect(logger.loggers.warn[0]).to.eq(loggerB);

    expect(Array.isArray(logger.loggers.error)).to.eq(true);
    expect(logger.loggers.error.length).to.eq(1);
    expect(logger.loggers.error[0]).to.eq(loggerC);

    expect(Array.isArray(logger.loggers.assert)).to.eq(true);
    expect(logger.loggers.assert.length).to.eq(1);
    expect(logger.loggers.assert[0]).to.eq(loggerD);
  });

  it('should store loggers passed', () => {
    const logger = new Logger(['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H']);

    expect(Array.isArray(logger.loggers.log)).to.eq(true);
    expect(logger.loggers.log.length).to.eq(2);
    expect(logger.loggers.log[0]).to.eq('A');
    expect(logger.loggers.log[1]).to.eq('B');

    expect(Array.isArray(logger.loggers.warn)).to.eq(true);
    expect(logger.loggers.warn.length).to.eq(2);
    expect(logger.loggers.warn[0]).to.eq('C');
    expect(logger.loggers.warn[1]).to.eq('D');

    expect(Array.isArray(logger.loggers.error)).to.eq(true);
    expect(logger.loggers.error.length).to.eq(2);
    expect(logger.loggers.error[0]).to.eq('E');
    expect(logger.loggers.error[1]).to.eq('F');

    expect(Array.isArray(logger.loggers.assert)).to.eq(true);
    expect(logger.loggers.assert.length).to.eq(2);
    expect(logger.loggers.assert[0]).to.eq('G');
    expect(logger.loggers.assert[1]).to.eq('H');
  });

  describe('getLoggerLevels', () => {
    it('should return an array', () => {
      const logger = new Logger();

      const levels = logger.getLoggerLevels();

      expect(Array.isArray(levels)).to.eq(true);
    });

    it('should be non empty array', () => {
      const logger = new Logger();

      const levels = logger.getLoggerLevels();

      expect(levels.length).to.gt(0);
    });

    it('should be an array of strings', () => {
      const logger = new Logger();

      const levels = logger.getLoggerLevels();

      expect(typeof levels[0]).to.eq('string');
    });
  });

  describe('setLevel', () => {
    it('should change the level, if the level is valid', () => {
      const logger = new Logger();
      logger.loggerLevel = 100;

      logger.setLevel('ERROR');

      expect(logger.loggerLevel).to.eq(1);
    });

    it('should not change the level, if the level is not valid', () => {
      const logger = new Logger();
      logger.loggerLevel = 100;

      logger.setLevel('ERR');

      expect(logger.loggerLevel).to.eq(100);
    });

    it('should not change the level, if no level is passed', () => {
      const logger = new Logger();
      logger.loggerLevel = 100;

      logger.setLevel();

      expect(logger.loggerLevel).to.eq(100);
    });
  });

  describe('debug', () => {
    it('should call debug logger, if log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const otherLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      logger.loggerLevel = 100;

      logger.debug('Test', 'Test message');

      expect(otherLogLine.log.callCount).to.eq(0);
      expect(logLine.log.callCount).to.eq(1);
    });

    it('should not call debug logger, if log level is too high', () => {
      const logLine = {
        log: sinon.spy()
      };
      const otherLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      logger.loggerLevel = 0;

      logger.debug('Test', 'Test message');

      expect(otherLogLine.log.callCount).to.eq(0);
      expect(logLine.log.callCount).to.eq(0);
    });

    it('should not throw if no debug logger is set', () => {
      const logLine = {
        log: sinon.spy()
      };

      const logger = new Logger(undefined, logLine, logLine, logLine);
      logger.loggerLevel = 100;

      expect(() => logger.debug('Test', 'Test message')).to.not.throw();
      expect(logLine.log.callCount).to.eq(0);
    });
  });

  describe('verbose', () => {
    it('should call verbose logger, if log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const otherLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      logger.loggerLevel = 100;

      logger.verbose('Test', 'Test message');

      expect(otherLogLine.log.callCount).to.eq(0);
      expect(logLine.log.callCount).to.eq(1);
    });

    it('should not call verbose logger, if log level is too high', () => {
      const logLine = {
        log: sinon.spy()
      };
      const otherLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      logger.loggerLevel = 0;

      logger.verbose('Test', 'Test message');

      expect(otherLogLine.log.callCount).to.eq(0);
      expect(logLine.log.callCount).to.eq(0);
    });

    it('should not throw if no verbose logger is set', () => {
      const logLine = {
        log: sinon.spy()
      };

      const logger = new Logger(undefined, logLine, logLine, logLine);
      logger.loggerLevel = 100;

      expect(() => logger.verbose('Test', 'Test message')).to.not.throw();
      expect(logLine.log.callCount).to.eq(0);
    });
  });

  describe('info', () => {
    it('should call info logger, if log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const otherLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      logger.loggerLevel = 100;

      logger.info('Test', 'Test message');

      expect(otherLogLine.log.callCount).to.eq(0);
      expect(logLine.log.callCount).to.eq(1);
    });

    it('should not call info logger, if log level is too high', () => {
      const logLine = {
        log: sinon.spy()
      };
      const otherLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, otherLogLine, otherLogLine, otherLogLine);
      logger.loggerLevel = 0;

      logger.info('Test', 'Test message');

      expect(otherLogLine.log.callCount).to.eq(0);
      expect(logLine.log.callCount).to.eq(0);
    });

    it('should not throw if no info logger is set', () => {
      const logLine = {
        log: sinon.spy()
      };

      const logger = new Logger(undefined, logLine, logLine, logLine);
      logger.loggerLevel = 100;

      expect(() => logger.info('Test', 'Test message')).to.not.throw();
      expect(logLine.log.callCount).to.eq(0);
    });
  });

  describe('warn', () => {
    it('should call warn logger, if log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const warnLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, warnLogLine, logLine, logLine);
      logger.loggerLevel = 100;

      logger.warn('Test', 'Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(warnLogLine.log.callCount).to.eq(1);
    });

    it('should not call warn logger, if log level is too high', () => {
      const logLine = {
        log: sinon.spy()
      };
      const warnLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, warnLogLine, logLine, logLine);
      logger.loggerLevel = 0;

      logger.warn('Test', 'Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(warnLogLine.log.callCount).to.eq(0);
    });

    it('should not throw if no warn logger is set', () => {
      const logLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, undefined, logLine, logLine);
      logger.loggerLevel = 100;

      expect(() => logger.warn('Test', 'Test message')).to.not.throw();
      expect(logLine.log.callCount).to.eq(0);
    });
  });

  describe('error', () => {
    it('should call error logger, if log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const errorLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, errorLogLine, logLine);
      logger.loggerLevel = 100;

      logger.error('Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(errorLogLine.log.callCount).to.eq(1);
    });

    it('should not call error logger, if log level is too high', () => {
      const logLine = {
        log: sinon.spy()
      };
      const errorLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, errorLogLine, logLine);
      logger.loggerLevel = 0;

      logger.error('Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(errorLogLine.log.callCount).to.eq(0);
    });

    it('should not throw if no error logger is set', () => {
      const logLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, undefined, logLine);
      logger.loggerLevel = 100;

      expect(() => logger.error('Test message')).to.not.throw();
      expect(logLine.log.callCount).to.eq(0);
    });
  });

  describe('assert', () => {
    it('should call assertion logger, if condition is false, and log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const assertionLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, logLine, assertionLogLine);
      logger.loggerLevel = 100;

      logger.assert(false, 'Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(assertionLogLine.log.callCount).to.eq(1);
    });

    it('should not call assertion logger, if condition is false, and log level is too high', () => {
      const logLine = {
        log: sinon.spy()
      };
      const assertionLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, logLine, assertionLogLine);
      logger.loggerLevel = 0;

      logger.assert(false, 'Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(assertionLogLine.log.callCount).to.eq(0);
    });

    it('should not call assertion logger, if condition is true, and log level is low enough', () => {
      const logLine = {
        log: sinon.spy()
      };
      const assertionLogLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, logLine, assertionLogLine);
      logger.loggerLevel = 100;

      logger.assert(true, 'Test message');

      expect(logLine.log.callCount).to.eq(0);
      expect(assertionLogLine.log.callCount).to.eq(0);
    });

    it('should not throw if no assertion logger is set', () => {
      const logLine = {
        log: sinon.spy()
      };

      const logger = new Logger(logLine, logLine, logLine, undefined);
      logger.loggerLevel = 100;

      expect(() => logger.assert(false, 'Test message')).to.not.throw();
      expect(logLine.log.callCount).to.eq(0);
    });
  });
});
