import * as process from 'process';

import { ILogger } from '../logger/ilogger';
import { IShutdownHandler } from './ishutdown-handler';
import { TShutdownCallback } from './tshutdown-callback';

/**
 * Shutdown handler.
 */
export class ShutdownHandler implements IShutdownHandler {
  // logger instance
  private logger: ILogger;
  // error status on exit
  private error: number = 0;
  // list of callbacks to call on exit
  private callbackList: TShutdownCallback[] = [];

  /**
   * Constructor.
   */
  public constructor(logger: ILogger) {
    this.logger = logger;

    this.logger.debug('Shutdown Handler', 'Adding listener for SIGINT');
    process.on('SIGINT', () => this.cleanUpAndExitHandler());
  }

  /**
   * Clean up and exit handler.
   */
  private async cleanUpAndExitHandler(): Promise<void> {
    this.logger.debug('Shutdown Handler', `Invoking any shutdown callbacks that have been registered ( ${this.callbackList.length} )`);    
    // call shut down callback
    const promiseList: Promise<void>[] = this.callbackList.map((handler: TShutdownCallback) => handler(this));
    // wait for all handlers to finish
    await Promise.all(promiseList);

    // exit
    this.logger.debug('Shutdown Handler', `Exiting with code ${this.error}`);
    process.exit(this.error);
  }

  /**
   * Set an exit code to show an error status.
   * @param {number} code - exit code to set.
   */
  public setErrorExitCode(code: number): void {
    this.logger.debug('Shutdown Handler', `Setting exit code: ${code}`);
    this.error = code;
  }

  /**
   * Add an exit callback to be called on shutdown.
   * @param {TShudownCallback} callback - callback function to call on shutdown.
   */
  public addCallback(callback: TShutdownCallback): void {
    this.logger.debug('Shutdown Handler', 'Adding shutdown callback');
    this.callbackList.push(callback);
  }
}
