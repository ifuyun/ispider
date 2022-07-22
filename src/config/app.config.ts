/**
 * 基本配置信息
 * @version 1.0.0
 * @since 1.0.0
 */
import { registerAs } from '@nestjs/config';

const APP_CONFIG = () => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT || '', 10) || 2016,
  logLevel: process.env.LOG_LEVEL || 'TRACE'
});

export default registerAs('app', APP_CONFIG);
