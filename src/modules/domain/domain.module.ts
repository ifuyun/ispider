import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';
import { DomainController } from './domain.controller';
import { DomainService } from './domain.service';

@Module({
  imports: [DatabaseModule, HttpModule, LoggerModule],
  controllers: [DomainController],
  providers: [DomainService],
  exports: [DomainService]
})
export class DomainModule {}
