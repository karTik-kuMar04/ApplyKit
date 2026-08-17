import pino from 'pino';
import { env } from './env';

const isDev = env.nodeEnv === 'development';

// Path-based redaction only catches known field names — it won't catch PII that ends up
// inside a free-form string, so avoid logging full request bodies at info level; log identifiers
// (template id, resume filename) instead of content.
const redactionPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.body',
  'req.body.subject',
  'res.headers["set-cookie"]',
  '*.supabaseServiceKey',
  '*.SUPABASE_SERVICE_ROLE_KEY',
];

export const logger = pino({
  level: env.logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: { service: 'resume-sync-backend' },
  redact: {
    paths: redactionPaths,
    censor: '[REDACTED]',
  },
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
        customColors: 'info:green,warn:yellow,error:red,fatal:red,debug:blue',
      },
    },
  }),
});
