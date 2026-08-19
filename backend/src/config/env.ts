import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  WEB_URL: process.env.WEB_URL,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabaseUrl: required('SUPABASE_URL'),
  // Service role key — server-side only, bypasses RLS. Never expose this to the Expo app.
  supabaseServiceKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  resumeBucket: process.env.RESUME_BUCKET ?? 'resumes',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  logLevel: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
};
