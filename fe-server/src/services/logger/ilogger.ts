import { ELoggerLevel } from './elogger-level';

/**
 * Logger interface.
 */
export interface ILogger {
  /**
   * Set current log level.
   * @param {LoggerLevel} level - new log level
   */
  setLevel: (level: ELoggerLevel) => void;

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  debug: (name: string, message: string) => void;

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  verbose: (name: string, message: string) => void;

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  info: (name: string, message: string) => void;

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   */
  warn: (name: string, message: string) => void;

  /**
   * Log an error.
   * @param {string} message - error message.
   */
  error: (message: string) => void;

  /**
   * Log an assert, if condition isn't met
   * @param {boolean} condition - assert when false.
   * @param {string} message - assertion message.
   */
  assert: (condition: boolean, message: string) => void;
}
