import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DevLogger } from './loggers/dev.logger';
import { JsonLogger } from './loggers/json.logger';
import { TskvLogger } from './loggers/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggerType = process.env.LOGGER_TYPE || 'dev';
  let logger;

  switch (loggerType) {
    case 'json':
      logger = new JsonLogger();
      break;
    case 'tskv':
      logger = new TskvLogger();
      break;
    case 'dev':
    default:
      logger = new DevLogger();
      break;
  }

  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
