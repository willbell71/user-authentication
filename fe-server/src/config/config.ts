import * as process from 'process';

require('dotenv').config();

/**
 * Env config.
 * @property {string} mode - mode.
 * @property {number} port - api port.
 * @property {string} logLevel - logger level.
 * @property {boolean} useCompression - enable gzip compression.
 * @property {boolean} disableCORS - disable CORS.
 */
type Config = {
  mode: string;
  port: number;
  logLevel: string;
  useCompression: boolean;
  disableCORS: boolean;
};

/**
 * Config.
 * @property {string} mode - mode.
 * @property {number} port - api port.
 * @property {string} logLevel - logger level.
 * @property {boolean} useCompression - enable gzip compression.
 * @property {boolean} disableCORS - disable CORS.
 * @property {string} dbConnection - connection string.
 */
export const config: Config = {
  mode: process.env.NAME || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'ALL',
  useCompression: 'true' === (process.env.USE_COMPRESSION || '').toLowerCase(),
  disableCORS: 'true' === (process.env.DISABLE_CORS || '').toLowerCase()
};
