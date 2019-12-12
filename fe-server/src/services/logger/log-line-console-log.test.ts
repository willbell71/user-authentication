import { ILogLine } from './ilog-line';
import { LogLineConsoleLog } from './log-line-console-log';

describe('LogLineConsoleLog', () => {
  it('should call console log', () => {
    const spy: jest.SpyInstance = jest.spyOn(global.console, 'log').mockImplementation();

    const logLine: ILogLine = new LogLineConsoleLog();

    logLine.log('date', 'pid', 'message');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
