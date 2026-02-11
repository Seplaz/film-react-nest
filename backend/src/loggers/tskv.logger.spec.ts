import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
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
    it('should format message in TSKV format', () => {
      const result = logger.formatMessage('log', 'test message');

      expect(result).toMatch(/^tskv\t/);
      expect(result).toContain('level=log');
      expect(result).toContain('message=test message');
      expect(result).toContain('timestamp=');
    });

    it('should include params when provided', () => {
      const result = logger.formatMessage('log', 'test', 'param1', 'param2');

      expect(result).toContain('params=');
      expect(result).toContain('param1');
      expect(result).toContain('param2');
    });

    it('should use tabs as separators', () => {
      const result = logger.formatMessage('log', 'test');

      const parts = result.split('\t');
      expect(parts.length).toBeGreaterThan(1);
      expect(parts[0]).toBe('tskv');
    });

    it('should include ISO timestamp', () => {
      const result = logger.formatMessage('log', 'test');

      const timestampMatch = result.match(/timestamp=([^\t]+)/);
      expect(timestampMatch).not.toBeNull();

      const timestamp = timestampMatch[1];
      expect(() => new Date(timestamp)).not.toThrow();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });

    it('should not include params when not provided', () => {
      const result = logger.formatMessage('log', 'test');

      expect(result).not.toContain('params=');
    });

    it('should handle object params', () => {
      const result = logger.formatMessage('log', 'test', { key: 'value' });

      expect(result).toContain('params=');
      expect(result).toContain('"key":"value"');
    });
  });

  describe('log', () => {
    it('should call console.log with TSKV formatted message', () => {
      logger.log('test message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];

      expect(output).toMatch(/^tskv\t/);
      expect(output).toContain('level=log');
      expect(output).toContain('message=test message');
    });

    it('should handle multiple parameters', () => {
      logger.log('test', 'param1', 'param2');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];

      expect(output).toContain('params=');
    });
  });

  describe('error', () => {
    it('should call console.error with TSKV formatted message', () => {
      logger.error('error message');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];

      expect(output).toContain('level=error');
      expect(output).toContain('message=error message');
    });

    it('should handle error with stack trace', () => {
      logger.error('error message', 'stack trace');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const output = consoleErrorSpy.mock.calls[0][0];

      expect(output).toContain('params=');
      expect(output).toContain('stack trace');
    });
  });

  describe('warn', () => {
    it('should call console.warn with TSKV formatted message', () => {
      logger.warn('warning message');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      const output = consoleWarnSpy.mock.calls[0][0];

      expect(output).toContain('level=warn');
      expect(output).toContain('message=warning message');
    });
  });

  describe('debug', () => {
    it('should call console.debug with TSKV formatted message', () => {
      logger.debug('debug message');

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      const output = consoleDebugSpy.mock.calls[0][0];

      expect(output).toContain('level=debug');
      expect(output).toContain('message=debug message');
    });
  });

  describe('verbose', () => {
    it('should call console.log with TSKV formatted message', () => {
      logger.verbose('verbose message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const output = consoleLogSpy.mock.calls[0][0];

      expect(output).toContain('level=verbose');
      expect(output).toContain('message=verbose message');
    });
  });
});
