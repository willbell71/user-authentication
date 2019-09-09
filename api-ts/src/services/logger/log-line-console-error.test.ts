import { ILogLine } from './ilog-line';
import { LogLineConsoleError } from './log-line-console-error';

describe('LogLineConsoleError', () => {
  it('should call console error', () => {
    const spy: jest.SpyInstance = jest.spyOn(global.console, 'error').mockImplementation();

    const logLine: ILogLine = new LogLineConsoleError();

    logLine.log('date', 'pid', 'message');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
