import { ILogLine } from './ilog-line';
import { LogLineConsoleWarn } from './log-line-console-warn';

describe('LogLineConsoleWarn', () => {
  it('should call console warn', () => {
    const spy: jest.SpyInstance = jest.spyOn(global.console, 'warn').mockImplementation();

    const logLine: ILogLine = new LogLineConsoleWarn();

    logLine.log('date', 'pid', 'message');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
