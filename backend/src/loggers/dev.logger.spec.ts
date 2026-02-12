import { DevLogger } from './dev.logger';
import { ConsoleLogger } from '@nestjs/common';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('должен быть определен', () => {
    expect(logger).toBeDefined();
  });

  it('должен быть экземпляром ConsoleLogger', () => {
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('должен иметь метод log', () => {
    expect(logger.log).toBeDefined();
    expect(typeof logger.log).toBe('function');
  });

  it('должен иметь метод error', () => {
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('должен иметь метод warn', () => {
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('должен иметь метод debug', () => {
    expect(logger.debug).toBeDefined();
    expect(typeof logger.debug).toBe('function');
  });

  it('должен иметь метод verbose', () => {
    expect(logger.verbose).toBeDefined();
    expect(typeof logger.verbose).toBe('function');
  });
});
