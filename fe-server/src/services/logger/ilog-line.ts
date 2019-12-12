/**
 * Log line interface.
 */
export interface ILogLine {
  /**
   * Write a line to a log.
   * @param {string} date - date string.
   * @param {string} pid - process id string.
   * @param {string} message - message string.
   */
  log: (date: string, pid: string, message: string) => void;
}
