import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LoggerModule } from '../logger/logger.module';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  imports: [DatabaseModule, LoggerModule],
  controllers: [MainController],
  providers: [MainService],
  exports: [MainService]
})
export class MainModule {}
