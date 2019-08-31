// @ts-check
'use strict';

const LogLine = require('./log-line');

/**
 * Log line class that uses console.error.
 */
class LogLineConsoleError extends LogLine {
  /**
   * Write a line to a log.
   * @param {string} date - date string.
   * @param {string} pid - process id string.
   * @param {string} message - message string.
   */
  log(date, pid, message) {
    console.error(`    ${date} ${pid} \x1b[1m\x1b[31m${message}\x1b[0m`);
  }
}

module.exports = LogLineConsoleError;
