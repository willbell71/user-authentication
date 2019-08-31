// @ts-check
'use strict';

const LogLine = require('./log-line');

/**
 * Log line class that uses console.log.
 */
class LogLineConsoleLog extends LogLine {
  /**
   * Write a line to a log.
   * @param {string} date - date string.
   * @param {string} pid - process id string.
   * @param {string} message - message string.
   */
  log(date, pid, message) {
    console.log(`    ${date} ${pid} \x1b[1m\x1b[32m${message}\x1b[0m`);
  }
}

module.exports = LogLineConsoleLog;
