import express, { Request, Response } from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'crypto';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import resumeRoutes from './routes/resumeRoutes';
import coverLetterRoutes from './routes/coverLetterRoutes';
import emailTemplateRoutes from './routes/emailTemplateRoutes';

export const app = express();

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => {
      const existingId = req.headers['x-request-id'];
      if (existingId) {
        return Array.isArray(existingId) ? existingId[0] : existingId;
      }
      return randomUUID();
    },
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) {
        return 'error';
      }
      if (res.statusCode >= 400) {
        return 'warn';
      }
      return 'info';
    },
  })
);

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Resume Sync Backend is running' });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', env: env.nodeEnv });
});

app.use('/api/resume', resumeRoutes);
app.use('/api/cover-letters', coverLetterRoutes);
app.use('/api/email-templates', emailTemplateRoutes);

// Must be last — catches errors passed via next(err) from any route above.
app.use(errorHandler);
