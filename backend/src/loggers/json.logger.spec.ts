import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  describe('formatMessage', () => {
    it('should format message as valid JSON', () => {
      const result = logger.formatMessage('log', 'test message');
      const parsed = JSON.parse(result);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test message');
      expect(parsed.optionalParams).toEqual([]);
    });

    it('should include optional parameters in JSON', () => {
      const result = logger.formatMessage('log', 'test', 'param1', 'param2');
      const parsed = JSON.parse(result);

      expect(parsed.optionalParams).toEqual(['param1', 'param2']);
    });

    it('should handle object parameters', () => {
      const result = logger.formatMessage('log', 'test', { key: 'value' });
      const parsed = JSON.parse(result);

      expect(parsed.optionalParams).toEqual([{ key: 'value' }]);
    });
  });

  describe('log', () => {
    it('should call console.log with formatted JSON', () => {
      logger.log('test message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test message');
    });

    it('should handle multiple parameters', () => {
      logger.log('test', 'param1', 'param2');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.optionalParams).toContain('param1');
    });
  });

  describe('error', () => {
    it('should call console.error with formatted JSON', () => {
      logger.error('error message', 'stack trace');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('error message');
    });
  });

  describe('warn', () => {
    it('should call console.warn with formatted JSON', () => {
      logger.warn('warning message');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('warning message');
    });
  });

  describe('debug', () => {
    it('should call console.debug with formatted JSON', () => {
      logger.debug('debug message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const output = consoleDebugSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('debug message');
    });
  });

  describe('verbose', () => {
    it('should call console.log with formatted JSON', () => {
      logger.verbose('verbose message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('verbose message');
    });
  });
});
