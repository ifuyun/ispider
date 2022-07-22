import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configure, getLogger, Logger } from 'log4js';
import * as moment from 'moment';
import { LogCategory } from '../../common/common.enum';
import { LogData } from './logger.interface';

@Injectable()
export class LoggerService {
  accessLogger: Logger;
  sysLogger: Logger;
  dbLogger: Logger;

  private logger: Logger;
  private logDay = moment().format('YYYY-MM-DD');

  constructor(private readonly configService: ConfigService) {
    const appenders = {};
    const categories = {
      default: {
        appenders: ['system'],
        level: configService.get('app.logLevel')
      }
    };
    for (const label in LogCategory) {
      if (LogCategory.hasOwnProperty(label)) {
        const category = LogCategory[label];
        appenders[category] = {
          type: 'multiFile',
          base: 'logs/',
          extension: '.log',
          property: 'logDay',
          compress: false, // backup files will have .gz extension
          maxLogSize: 10485760, // 10MB
          backups: 10 // 默认5
        };
        categories[category] = {
          appenders: [category],
          level: configService.get('app.logLevel')
        };
      }
    }
    configure({
      pm2: false,
      pm2InstanceVar: 'NEST_APP_INSTANCE',
      disableClustering: false,
      appenders,
      categories
    });

    for (const label in LogCategory) {
      if (LogCategory.hasOwnProperty(label)) {
        const category = LogCategory[label];
        this[label] = getLogger(category);
        this[label].addContext('logDay', category + '/' + this.logDay);
      }
    }
    this.logger = this.sysLogger; // by default
  }

  updateContext() {
    const today = moment().format('YYYY-MM-DD');
    if (today !== this.logDay) {
      for (const label in LogCategory) {
        if (LogCategory.hasOwnProperty(label)) {
          this[label].addContext('logDay', LogCategory[label] + '/' + today);
        }
      }
    }
  }

  transformLogData(logData: string | LogData, ...args: any[]): Array<string | LogData> {
    if (args.length > 0) {
      return [logData, ...args];
    }
    let logStr = '';
    if (typeof logData === 'string') {
      logStr = `[Msg] ${logData}`;
    } else {
      logStr += logData.message ? `[Msg] ${logData.message}` : '';
      logStr += logData.data ? (logStr ? '\n' : '') + `[Data] ${JSON.stringify(logData.data)}` : '';
      logStr += logData.visitorInfo ? (logStr ? '\n' : '') + `[User] ${logData.visitorInfo}` : '';
      logStr += logData.stack ? (logStr ? '\n' : '') + `[Stack] ${logData.stack}` : '';
    }

    return [logStr];
  }

  trace(logData: string | LogData, ...args: any[]) {
    this.logger.trace.call(this.logger, ...this.transformLogData(logData, ...args));
  }

  debug(logData: string | LogData, ...args: any[]) {
    this.logger.debug.call(this.logger, ...this.transformLogData(logData, ...args));
  }

  info(logData: string | LogData, ...args: any[]) {
    this.logger.info.call(this.logger, ...this.transformLogData(logData, ...args));
  }

  warn(logData: string | LogData, ...args: any[]) {
    this.logger.warn.call(this.logger, ...this.transformLogData(logData, ...args));
  }

  error(logData: string | LogData, ...args: any[]) {
    this.logger.error.call(this.logger, ...this.transformLogData(logData, ...args));
  }

  fatal(logData: string | LogData, ...args: any[]) {
    this.logger.fatal.call(this.logger, ...this.transformLogData(logData, ...args));
  }

  mark(logData: string | LogData, ...args: any[]) {
    this.logger.mark.call(this.logger, ...this.transformLogData(logData, ...args));
  }
}
