import * as process from 'process';
import { Writable } from 'stream';

import { ILogger } from './ilogger';
import { ILogLine } from './ilog-line';
import { ELoggerLevel } from './elogger-level';

type Loggers = {
  log: ILogLine[];
  warn: ILogLine[];
  error: ILogLine[];
  assert: ILogLine[];
};

/**
 * Logger
 */
export class Logger extends Writable implements ILogger {
  // log level
  private loggerLevel: ELoggerLevel = ELoggerLevel.ALL;

  // registered loggers
  private loggers: Loggers;

  /**
   * Constructor
   * @param {ILogLine|ILogLine[]} log - generic loggers.
   * @param {ILogLine|ILogLine[]} warn - warning specific loggers.
   * @param {ILogLine|ILogLine[]} error - error specific loggers.
   * @param {ILogLine|ILogLine[]} assert - assert specific loggers.
   */
  public constructor(log: ILogLine|ILogLine[], warn: ILogLine|ILogLine[], error: ILogLine|ILogLine[], assert: ILogLine|ILogLine[]) {
    // call parent contructor
    super();

    // initial loggers
    const setKey: (key: ILogLine|ILogLine[]) => ILogLine[] = (key: ILogLine|ILogLine[]): ILogLine[] => Array.isArray(key) ? key : [key];
    this.loggers = {
      log: setKey(log),
      warn: setKey(warn),
      error: setKey(error),
      assert: setKey(assert)
    };
  }

  /**
   * Write message.
   * @param {Loggers} loggers - loggers.
   * @param {number} loggerLevel - message logger level.
   * @param {number} level - message logger level.
   * @param {string} message - message to write.
   * @return {void}
   */
  private writeLog(loggers: Loggers, loggerLevel: number, level: number, message: string): void {
    if (loggerLevel >= level) {
      const date: string = new Date().toISOString();
      const pid: string = `${process.pid}`;

      switch (level) {
        case ELoggerLevel.ASSERT: loggers.assert.forEach((logger: ILogLine) => logger.log(date, pid, message)); break;
        case ELoggerLevel.ERROR: loggers.error.forEach((logger: ILogLine) => logger.log(date, pid, message)); break;
        case ELoggerLevel.WARN: loggers.warn.forEach((logger: ILogLine) => logger.log(date, pid, message)); break;
        default: loggers.log.forEach((logger: ILogLine) => logger.log(date, pid, message)); break;
      }
    }
  }
 
  /**
   * Get current stack.
   * @return {string[]} current stack, one line per call, starting will function that called this
   */
  private getStack(): string[] {
    const stack: string = new Error().stack || '';
    return stack.split('\n')
      // first line is error, remove that
      // second line is this function, remove that
      .filter((_: string, count: number) => count > 1)
      // tidy line, just want function, file and line
      .map((line: string) => line.replace(/\s{4}at\s/, ''));
  }
 
  /**
   * Set current log level.
   * @param {ELoggerLevel} level - new log level
   * @return {void}
   */
  public setLevel(level: ELoggerLevel): void {
    this.loggerLevel = level;
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   * @return {void}
   */
  public debug(name: string, message: string): void {
    this.writeLog(this.loggers, this.loggerLevel, ELoggerLevel.DEBUG, `${name}: ${message}`);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   * @return {void}
   */
  public verbose(name: string, message: string): void {
    this.writeLog(this.loggers, this.loggerLevel, ELoggerLevel.VERBOSE, `${name}: ${message}`);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   * @return {void}
   */
  public info(name: string, message: string): void {
    this.writeLog(this.loggers, this.loggerLevel, ELoggerLevel.INFO, `${name}: ${message}`);
  }

  /**
   * Log a message.
   * @param {string} name - name of logger.
   * @param {string} message - message to log.
   * @return {void}
   */
  public warn(name: string, message: string): void {
    this.writeLog(this.loggers, this.loggerLevel, ELoggerLevel.WARN, `${name}: ${message}`);
  }

  /**
   * Log an error.
   * @param {string} message - error message.
   * @return {void}
   */
  public error(message: string): void {
    this.writeLog(this.loggers, this.loggerLevel, ELoggerLevel.ERROR, `ERROR: ${message}`);
  }

  /**
   * Log an assert, if condition isn't met
   * @param {boolean} condition - assert when false.
   * @param {string} message - assertion message.
   * @return {void}
   */
  public assert(condition: boolean, message: string): void {
    if (!condition) {
      // first stack line ([0]) will be us, second line ([1]) will be who called us
      const stack: string[] = this.getStack();
      this.writeLog(this.loggers, this.loggerLevel, ELoggerLevel.ASSERT, `${message} (${stack[1]})`);
    }
  }

  // Writable interface

  /**
   * Write some data to the stream
   * @param {string} chunk - data to write to stream.
   * @param {string} encoding - data encoding.
   * @param {() => void} callback - callback to invoke after writing.
   */
  public _write(chunk: string, encoding: string, callback: () => void): void {
    // log message, but not newline on the end of the line
    this.verbose('API', chunk.slice(0, -1));
    callback();
  }
}
