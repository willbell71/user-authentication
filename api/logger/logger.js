// @ts-check
'use strict';

const process = require('process');
const {Writable} = require('stream');

// define internal logger levels
const _loggerLevels = {
  NONE: 0,

  ERROR: 1,
  ASSERT: 2,
  WARN: 3,
  INFO: 4,
  VERBOSE: 5,
  DEBUG: 6,

  ALL: 100
};

/**
 * Write message.
 * @param {*} loggers - loggers.
 * @param {number} loggerLevel - message logger level.
 * @param {number} level - message logger level.
 * @param {string} message - message to write.
 */
function _write({log, warn, error, assert}, loggerLevel, level, message) {
  if (loggerLevel >= level) {
    const date = new Date().toISOString();
    const pid = `${process.pid}`;

    switch (level) {
      case _loggerLevels.ASSERT:
        if (assert) {
          assert.forEach(logger => logger.log(date, pid, message));
        }
        break;
      case _loggerLevels.ERROR:
        if (error) {
          error.forEach(logger => logger.log(date, pid, message));
        }
        break;
      case _loggerLevels.WARN:
        if (warn) {
          warn.forEach(logger => logger.log(date, pid, message));
        }
        break;
      default:
        if (log) {
          log.forEach(logger => logger.log(date, pid, message));
        }
        break;
    }
  }
}

/**
 * Get current stack.
 * @return {string[]} current stack, one line per call, starting will function that called this
 */
function _getStack() {
  const stack = new Error().stack;
  return stack.split('\n')
    // first line is error, remove that
    // second line is this function, remove that
    .filter((_, count) => count > 1)
    // tidy line, just want function, file and line
    .map(line => line.replace(/\s{4}at\s/, ''));
}

/**
 * Logger
 */
class Logger {
  /**
   * Constructor
   * @param {LogLine|LogLine[]} log - generic loggers.
   * @param {LogLine|LogLine[]} warn - warning specific loggers.
   * @param {LogLine|LogLine[]} error - error specific loggers.
   * @param {LogLine|LogLine[]} assert - assert specific loggers.
   */
  constructor(log, warn, error, assert) {
    // set initial logger level to log everything
    this.loggerLevel = _loggerLevels.ALL;

    const setKey = key => key ? (Array.isArray(key) ? key : [key]) : key;

    // initial loggers
    this.loggers = {
      log: setKey(log),
      warn: setKey(warn),
      error: setKey(error),
      assert: setKey(assert)
    };
  }

  /**
   * Get a list of logger levels.
   * @return {string[]} return list of logger levels.
   */
  getLoggerLevels() {
    return Object.keys(_loggerLevels);
  }

  /**
   * Set current log level.
   * @param {string} level - new log level
   */
  setLevel(level) {
    level = level ? level.toUpperCase() : '';
    if (_loggerLevels.hasOwnProperty(level)) {
      this.loggerLevel = _loggerLevels[level];
    }
  }

  /**
   * API Logger instance, pass this to Morgan to log API requests.
   * @return {APILogger} writeable stream.
   */
  getAPILogger() {
    /**
     * API logger,
     */
    class APILogger extends Writable {
      /**
       * Constructor
       * @param {Logger} loggerInstance - logger instance to log with.
       */
      constructor(loggerInstance) {
        super();

        this.logger = loggerInstance;
      }

      /**
       * Write some data to the stream
       * @param {string} chunk - data to write to stream.
       * @param {string} encoding - data encoding.
       * @param {function} callback - callback to invoke after writing.
       */
      _write(chunk, encoding, callback) {
        // log message, but not newline on the end of the line
        this.logger.verbose('API', chunk.slice(0, -1));
        callback();
      }
    }

    // return API logger instance
    return new APILogger(this);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  debug(name, message) {
    _write(this.loggers, this.loggerLevel, _loggerLevels.DEBUG, `${name}: ${message}`);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  verbose(name, message) {
    _write(this.loggers, this.loggerLevel, _loggerLevels.VERBOSE, `${name}: ${message}`);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  info(name, message) {
    _write(this.loggers, this.loggerLevel, _loggerLevels.INFO, `${name}: ${message}`);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  warn(name, message) {
    _write(this.loggers, this.loggerLevel, _loggerLevels.WARN, `${name}: ${message}`);
  }

  /**
   * Log an error.
   * @param {string} message - error message.
   */
  error(message) {
    _write(this.loggers, this.loggerLevel, _loggerLevels.ERROR, `ERROR: ${message}`);
  }

  /**
   * Log an assert, if condition isn't met
   * @param {boolean} condition - assert when false.
   * @param {string} message - assertion message.
   */
  assert(condition, message) {
    if (!condition) {
      // first stack line ([0]) will be us, second line ([1]) will be who called us
      const stack = _getStack();
      _write(this.loggers, this.loggerLevel, _loggerLevels.ASSERT, `${message} (${stack[1]})`);
    }
  }
}

module.exports = Logger;
