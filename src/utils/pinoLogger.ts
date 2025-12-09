import { config } from '@/config';
import pino from 'pino'
import pinoHttp from 'pino-http'

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  base : {
    service : config.SERVICE_NAME
  },
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
});


// Express HTTP middleware
export const httpLogger = pinoHttp({
  logger,
customLogLevel(_, res, err) {
  const status = res.statusCode ?? 500;
  const isRealError = err instanceof Error;

  if (isRealError || status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'info';
},
  serializers: {
    req(req) {
      return { method: req.method, url: req.url }
    },
    res(res) {
      return { statusCode: res.statusCode }
    },
  },
})

// Wrap default logger to automatically include trace info
const baseLogger = {
  // Use a generic function for non-error levels
  log: (level: pino.Level, msg: string, meta?: any) => {
    logger[level]({...meta }, msg);
  },

  info: (msg: string, meta?: any) => baseLogger.log('info', msg, meta),
  warn: (msg: string, meta?: any) => baseLogger.log('warn', msg, meta),
  debug: (msg: string, meta?: any) => baseLogger.log('debug', msg, meta),
  error: (msg: string, meta?: any) => {
    
    // Check if the 'meta' object is actually an Error instance
    if (meta instanceof Error) {
      // 1. Pass the Error object using the 'err' property
      // 2. Add the trace context explicitly
      logger.error({ 
        err: meta, 
      }, msg);
      return;
    }
    
    // Fallback for non-Error meta objects
    logger.error({ ...meta }, msg);
  },
};

export default baseLogger
