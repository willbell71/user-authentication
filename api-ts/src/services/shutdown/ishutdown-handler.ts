import { TShutdownCallback } from './tshutdown-callback';

export interface IShutdownHandler {
  /**
   * Set an exit code to show an error status.
   * @param {number} code - exit code to set.
   */
  setErrorExitCode: (code: number) => void;

  /**
   * Add an exit callback to be called on shutdown.
   * @param {TShudownCallback} callback - callback function to call on shutdown.
   */
  addCallback: (callback: TShutdownCallback) => void;
}
