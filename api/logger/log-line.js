// @ts-check
'use strict';

/**
 * Log line class.
 */
class LogLine {
  /**
   * Write a line to a log.
   * @param {string} date - date string.
   * @param {string} pid - process id string.
   * @param {string} message - message string.
   */
  log(date, pid, message) {
    console.log(date, pid, message);
  }
}

module.exports = LogLine;
