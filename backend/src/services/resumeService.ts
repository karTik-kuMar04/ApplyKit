import { BaseLogger } from 'pino';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { logger as defaultLogger } from '../config/logger';
import { AppError } from '../middleware/errorHandler';
import { ResumeMeta } from '../types';

const CURRENT_RESUME_PATH = 'current/resume.pdf';
const META_TABLE = 'resume_meta';
const META_ROW_ID = 'current';

// Overwrites the single "current" resume file, then upserts its metadata row.
// This is deliberately "latest wins" — no version history yet, matches the roadmap's phase 2 scope.
export async function uploadResume(
  fileBuffer: Buffer,
  originalFilename: string,
  logger: BaseLogger = defaultLogger
): Promise<ResumeMeta> {
  logger.debug(
    { original_filename: originalFilename, size_bytes: fileBuffer.length },
    'Uploading resume to storage'
  );

  const { error: uploadError } = await supabase.storage
    .from(env.resumeBucket)
    .upload(CURRENT_RESUME_PATH, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    logger.error({ err: uploadError }, 'Failed to upload resume to storage bucket');
    throw new AppError(`Failed to upload resume: ${uploadError.message}`, 502);
  }

  logger.debug(
    { file_path: CURRENT_RESUME_PATH, size_bytes: fileBuffer.length },
    'Resume file uploaded successfully'
  );

  const meta: ResumeMeta = {
    id: META_ROW_ID,
    file_path: CURRENT_RESUME_PATH,
    original_filename: originalFilename,
    uploaded_at: new Date().toISOString(),
    size_bytes: fileBuffer.length,
  };

  const { error: metaError } = await supabase
    .from(META_TABLE)
    .upsert(meta, { onConflict: 'id' });

  if (metaError) {
    logger.error({ err: metaError }, 'Failed to upsert resume metadata');
    throw new AppError(`Resume uploaded but failed to save metadata: ${metaError.message}`, 502);
  }

  logger.debug({ id: META_ROW_ID, file_path: CURRENT_RESUME_PATH }, 'Resume metadata saved');
  return meta;
}

export async function getResumeMeta(logger: BaseLogger = defaultLogger): Promise<ResumeMeta | null> {
  logger.debug({ id: META_ROW_ID }, 'Fetching resume metadata from Supabase');

  const { data, error } = await supabase
    .from(META_TABLE)
    .select('*')
    .eq('id', META_ROW_ID)
    .maybeSingle();

  if (error) {
    logger.error({ err: error }, 'Failed to fetch resume metadata');
    throw new AppError(`Failed to fetch resume metadata: ${error.message}`, 502);
  }

  return data;
}

// Signed URL — the app fetches this and downloads directly from Supabase,
// so the resume bytes never have to round-trip through this server.
export async function getResumeDownloadUrl(
  logger: BaseLogger = defaultLogger
): Promise<string> {
  logger.debug({ file_path: CURRENT_RESUME_PATH }, 'Generating signed URL for resume download');

  const { data, error } = await supabase.storage
    .from(env.resumeBucket)
    .createSignedUrl(CURRENT_RESUME_PATH, 60 * 10); // 10 minute expiry

  if (error || !data) {
    logger.error({ err: error }, 'Failed to generate signed download URL');
    throw new AppError(`Failed to create download URL: ${error?.message ?? 'unknown error'}`, 502);
  }

  return data.signedUrl;
}
