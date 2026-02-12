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

  it('должен быть определен', () => {
    expect(logger).toBeDefined();
  });

  it('должен возвращать строку в формате TSKV из formatMessage', () => {
    const result = logger.formatMessage('log', 'тест');

    expect(result).toContain('level=');
    expect(result).toContain('message=');
    expect(result).toContain('timestamp=');
    expect(result).toContain('\t');
  });

  it('должен разделять пары ключ=значение табуляцией', () => {
    const result = logger.formatMessage('log', 'тест');
    const parts = result.split('\t');

    expect(parts.length).toBeGreaterThan(1);
    parts.forEach((part) => {
      expect(part).toContain('=');
    });
  });

  it('должен экранировать символ новой строки', () => {
    const result = logger.formatMessage('log', 'строка\nс переносом');

    expect(result).toContain('\\n');
    expect(result).not.toContain('\n');
  });

  it('должен экранировать символ табуляции', () => {
    const result = logger.formatMessage('log', 'строка\tс табом');

    expect(result).toContain('\\t');
  });

  it('должен экранировать символ возврата каретки', () => {
    const result = logger.formatMessage('log', 'строка\rс возвратом');

    expect(result).toContain('\\r');
  });

  it('должен экранировать знак равенства', () => {
    const result = logger.formatMessage('log', 'a=b');

    expect(result).toContain('\\=');
  });

  it('должен экранировать обратный слеш', () => {
    const result = logger.formatMessage('log', 'путь\\файл');

    expect(result).toContain('\\\\');
  });

  it('должен включать правильный level в TSKV', () => {
    const result = logger.formatMessage('error', 'сообщение');

    expect(result).toContain('level=error');
  });

  it('должен включать message в TSKV', () => {
    const result = logger.formatMessage('log', 'тестовое сообщение');

    expect(result).toContain('message=тестовое сообщение');
  });

  it('должен вызывать console.log с отформатированным TSKV при вызове log', () => {
    logger.log('тестовое сообщение');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleLogSpy.mock.calls[0][0];

    expect(loggedMessage).toContain('level=log');
    expect(loggedMessage).toContain('message=тестовое сообщение');
  });

  it('должен вызывать console.error с отформатированным TSKV при вызове error', () => {
    logger.error('ошибка');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleErrorSpy.mock.calls[0][0];

    expect(loggedMessage).toContain('level=error');
    expect(loggedMessage).toContain('message=ошибка');
  });

  it('должен вызывать console.warn с отформатированным TSKV при вызове warn', () => {
    logger.warn('предупреждение');

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleWarnSpy.mock.calls[0][0];

    expect(loggedMessage).toContain('level=warn');
    expect(loggedMessage).toContain('message=предупреждение');
  });

  it('должен вызывать console.debug с отформатированным TSKV при вызове debug', () => {
    logger.debug('отладка');

    expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleDebugSpy.mock.calls[0][0];

    expect(loggedMessage).toContain('level=debug');
    expect(loggedMessage).toContain('message=отладка');
  });

  it('должен вызывать console.log с отформатированным TSKV при вызове verbose', () => {
    logger.verbose('подробное сообщение');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = consoleLogSpy.mock.calls[0][0];

    expect(loggedMessage).toContain('level=verbose');
    expect(loggedMessage).toContain('message=подробное сообщение');
  });

  it('должен включать optionalParams в TSKV если они есть', () => {
    logger.log('сообщение', 'param1', 'param2');

    const loggedMessage = consoleLogSpy.mock.calls[0][0];

    expect(loggedMessage).toContain('optionalParams=');
  });

  it('должен включать timestamp в TSKV', () => {
    const result = logger.formatMessage('log', 'тест');

    expect(result).toContain('timestamp=');
  });
});
