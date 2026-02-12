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

  it('должен быть определен', () => {
    expect(logger).toBeDefined();
  });

  it('должен возвращать валидный JSON из formatMessage', () => {
    const result = logger.formatMessage('log', 'тест', 'param1');
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('должен включать level, message, optionalParams и timestamp в JSON', () => {
    const result = logger.formatMessage('log', 'тестовое сообщение', 'param1');
    const parsed = JSON.parse(result);

    expect(parsed).toHaveProperty('level');
    expect(parsed).toHaveProperty('message');
    expect(parsed).toHaveProperty('optionalParams');
    expect(parsed).toHaveProperty('timestamp');
  });

  it('должен устанавливать правильный level в JSON', () => {
    const result = logger.formatMessage('error', 'сообщение');
    const parsed = JSON.parse(result);

    expect(parsed.level).toBe('error');
  });

  it('должен устанавливать правильное message в JSON', () => {
    const result = logger.formatMessage('log', 'тестовое сообщение');
    const parsed = JSON.parse(result);

    expect(parsed.message).toBe('тестовое сообщение');
  });

  it('должен вызывать console.log с отформатированным JSON при вызове log', () => {
    logger.log('тестовое сообщение');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('тестовое сообщение');
  });

  it('должен вызывать console.error с отформатированным JSON при вызове error', () => {
    logger.error('ошибка');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleErrorSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('ошибка');
  });

  it('должен вызывать console.warn с отформатированным JSON при вызове warn', () => {
    logger.warn('предупреждение');

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleWarnSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.level).toBe('warn');
    expect(parsed.message).toBe('предупреждение');
  });

  it('должен вызывать console.debug с отформатированным JSON при вызове debug', () => {
    logger.debug('отладка');

    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleDebugSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.level).toBe('debug');
    expect(parsed.message).toBe('отладка');
  });

  it('должен вызывать console.log с отформатированным JSON при вызове verbose', () => {
    logger.verbose('подробное сообщение');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.level).toBe('verbose');
    expect(parsed.message).toBe('подробное сообщение');
  });

  it('должен включать optionalParams в JSON', () => {
    logger.log('сообщение', 'param1', 'param2');

    const loggedMessage = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(loggedMessage);

    expect(parsed.optionalParams).toEqual([['param1', 'param2']]);
  });
});
