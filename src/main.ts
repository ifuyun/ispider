import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as cluster from 'cluster';
import * as compress from 'compression';
import * as ejs from 'ejs';
import { Request, Response } from 'express';
import * as log4js from 'log4js';
import * as favicon from 'serve-favicon';
import { cpus } from 'os';
import { join } from 'path';
import { AppModule } from './app.module';
import { LogLevel } from './common/common.enum';
import { LoggerService } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.select(AppModule).get(LoggerService, { strict: true });
  const config = app.select(AppModule).get(ConfigService, { strict: true });
  const isCluster = config.get('env.isCluster');
  const { accessLogger, sysLogger, transformLogData } = logger;
  /* cluster模式必须在app实例化之后，否则将缺少master进程，导致log4js报错，因此无法通过ClusterService.clusterize方式调用 */
  if ((cluster as any).isPrimary && isCluster) {
    const workerSize = Math.max(cpus().length, 2);
    for (let cpuIdx = 0; cpuIdx < workerSize; cpuIdx += 1) {
      (cluster as any).fork();
    }

    (cluster as any).on('exit', (worker, code, signal) => {
      sysLogger.error(
        transformLogData({
          message: `Worker ${worker.process.pid} exit.`,
          data: {
            code,
            signal
          }
        })[0]
      );
      process.nextTick(() => {
        sysLogger.info(transformLogData({ message: 'New process is forking...' })[0]);
        (cluster as any).fork();
      });
    });
  } else {
    /* if @types/ejs is installed, it'll be an error as it's read-only */
    ejs.delimiter = '?';
    app.setViewEngine('ejs');
    app.use(compress());

    app.use(bodyParser.json({ limit: '2mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.enable('trust proxy');

    app.use(favicon(join(__dirname, '..', 'web', 'assets', 'images', 'favicon.ico')));
    app.useStaticAssets(join(__dirname, '..', 'web', 'assets'));
    app.setBaseViewsDir(join(__dirname, '..', 'web', 'views'));

    app.use((req: Request, res: Response, next: () => void) => {
      logger.updateContext();
      next();
    });
    app.use(
      log4js.connectLogger(accessLogger, {
        level: LogLevel.INFO,
        format: (req, res, format) => {
          return format(
            ':remote-addr - :method :status HTTP/:http-version :url - [:response-time ms/:content-length B] ":referrer" ":user-agent"'
          );
        }
      })
    );

    await app.listen(config.get('app.port'), config.get('app.host'), () => {
      sysLogger.info(
        transformLogData({ message: `Server listening on: ${config.get('app.host')}:${config.get('app.port')}` })[0]
      );
    });
  }
}

bootstrap();
