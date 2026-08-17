import { BaseLogger } from 'pino';
import { supabase } from '../config/supabase';
import { logger as defaultLogger } from '../config/logger';
import { AppError } from '../middleware/errorHandler';
import { CoverLetterTemplate, RenderFieldsInput } from '../types';
import { renderTemplate } from './templateRenderer';

const TABLE = 'cover_letter_templates';

export async function listCoverLetters(
  logger: BaseLogger = defaultLogger
): Promise<CoverLetterTemplate[]> {
  logger.debug('Listing cover letters from Supabase');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    logger.error({ err: error }, 'Failed to fetch cover letters');
    throw new AppError(`Failed to fetch cover letters: ${error.message}`, 502);
  }
  return data ?? [];
}

export async function getCoverLetter(
  id: string,
  logger: BaseLogger = defaultLogger
): Promise<CoverLetterTemplate> {
  logger.debug({ id }, 'Fetching cover letter by ID');
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) {
    logger.error({ id, err: error }, 'Failed to fetch cover letter');
    throw new AppError(`Failed to fetch cover letter: ${error.message}`, 502);
  }
  if (!data) {
    logger.debug({ id }, 'Cover letter template not found');
    throw new AppError('Cover letter template not found', 404);
  }
  return data;
}

export async function createCoverLetter(
  name: string,
  body: string,
  logger: BaseLogger = defaultLogger
): Promise<CoverLetterTemplate> {
  logger.debug({ name }, 'Creating cover letter template');
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name, body, created_at: now, updated_at: now })
    .select()
    .single();

  if (error) {
    logger.error({ name, err: error }, 'Failed to create cover letter');
    throw new AppError(`Failed to create cover letter: ${error.message}`, 502);
  }
  logger.debug({ id: data.id, name }, 'Cover letter created successfully');
  return data;
}

export async function updateCoverLetter(
  id: string,
  fields: Partial<Pick<CoverLetterTemplate, 'name' | 'body'>>,
  logger: BaseLogger = defaultLogger
): Promise<CoverLetterTemplate> {
  logger.debug({ id, updatedFields: Object.keys(fields) }, 'Updating cover letter template');
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error({ id, err: error }, 'Failed to update cover letter');
    throw new AppError(`Failed to update cover letter: ${error.message}`, 502);
  }
  if (!data) {
    logger.debug({ id }, 'Cover letter template to update not found');
    throw new AppError('Cover letter template not found', 404);
  }
  return data;
}

export async function deleteCoverLetter(
  id: string,
  logger: BaseLogger = defaultLogger
): Promise<void> {
  logger.debug({ id }, 'Deleting cover letter template');
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    logger.error({ id, err: error }, 'Failed to delete cover letter');
    throw new AppError(`Failed to delete cover letter: ${error.message}`, 502);
  }
  logger.debug({ id }, 'Cover letter template deleted successfully');
}

export async function renderCoverLetter(
  id: string,
  fields: RenderFieldsInput,
  logger: BaseLogger = defaultLogger
): Promise<string> {
  logger.debug({ id }, 'Rendering cover letter template');
  const template = await getCoverLetter(id, logger);
  return renderTemplate(template.body, fields);
}
