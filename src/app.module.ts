import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import APP_CONFIG from './config/app.config';
import ENV_CONFIG from './config/env.config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggerService } from './modules/logger/logger.service';
import { MainModule } from './modules/main/main.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/${process.env.ENV}.env`,
      load: [ENV_CONFIG, APP_CONFIG]
    }),
    MainModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    ConfigService,
    LoggerService
  ]
})
export class AppModule {}
