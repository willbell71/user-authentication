import { ILogLine } from './ilog-line';

/**
 * Log line class that uses console.warn.
 */
export class LogLineConsoleWarn implements ILogLine {
  /**
   * Write a line to a log.
   * @param {string} date - date string.
   * @param {string} pid - process id string.
   * @param {string} message - message string.
   * @return {void}
   */
  public log(date: string, pid: string, message: string): void {
    // eslint-disable-next-line no-console
    console.warn(`    ${date} ${pid} \x1b[1m\x1b[33m${message}\x1b[0m`);
  }
}
