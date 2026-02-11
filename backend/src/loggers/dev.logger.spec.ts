import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should extend ConsoleLogger', () => {
    expect(logger.log).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.verbose).toBeDefined();
  });
});
