import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

app.listen(env.port, () => {
  logger.info(`resume-sync-backend listening on http://localhost:${env.port}`);
  logger.info(`environment: ${env.nodeEnv}`);
});
