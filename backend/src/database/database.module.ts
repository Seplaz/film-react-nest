import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        name: 'default',
        host:
          configService
            .get<string>('DATABASE_URL')
            ?.split('@')[1]
            ?.split(':')[0] || 'localhost',
        port: parseInt(
          configService
            .get<string>('DATABASE_URL')
            ?.split(':')[3]
            ?.split('/')[0] || '5432',
        ),
        database:
          configService.get<string>('DATABASE_URL')?.split('/').pop() ||
          'films',
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        entities: [Film, Schedule],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
