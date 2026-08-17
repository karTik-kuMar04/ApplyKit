import { BaseLogger } from 'pino';
import { supabase } from '../config/supabase';
import { logger as defaultLogger } from '../config/logger';
import { AppError } from '../middleware/errorHandler';
import { EmailTemplate, RenderFieldsInput } from '../types';
import { renderTemplate } from './templateRenderer';

const TABLE = 'email_templates';

export async function listEmailTemplates(
  logger: BaseLogger = defaultLogger
): Promise<EmailTemplate[]> {
  logger.debug('Listing email templates from Supabase');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    logger.error({ err: error }, 'Failed to fetch email templates');
    throw new AppError(`Failed to fetch email templates: ${error.message}`, 502);
  }
  return data ?? [];
}

export async function getEmailTemplate(
  id: string,
  logger: BaseLogger = defaultLogger
): Promise<EmailTemplate> {
  logger.debug({ id }, 'Fetching email template by ID');
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) {
    logger.error({ id, err: error }, 'Failed to fetch email template');
    throw new AppError(`Failed to fetch email template: ${error.message}`, 502);
  }
  if (!data) {
    logger.debug({ id }, 'Email template not found');
    throw new AppError('Email template not found', 404);
  }
  return data;
}

export async function createEmailTemplate(
  name: string,
  subject: string,
  body: string,
  logger: BaseLogger = defaultLogger
): Promise<EmailTemplate> {
  logger.debug({ name }, 'Creating email template');
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name, subject, body, created_at: now, updated_at: now })
    .select()
    .single();

  if (error) {
    logger.error({ name, err: error }, 'Failed to create email template');
    throw new AppError(`Failed to create email template: ${error.message}`, 502);
  }
  logger.debug({ id: data.id, name }, 'Email template created successfully');
  return data;
}

export async function updateEmailTemplate(
  id: string,
  fields: Partial<Pick<EmailTemplate, 'name' | 'subject' | 'body'>>,
  logger: BaseLogger = defaultLogger
): Promise<EmailTemplate> {
  logger.debug({ id, updatedFields: Object.keys(fields) }, 'Updating email template');
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error({ id, err: error }, 'Failed to update email template');
    throw new AppError(`Failed to update email template: ${error.message}`, 502);
  }
  if (!data) {
    logger.debug({ id }, 'Email template to update not found');
    throw new AppError('Email template not found', 404);
  }
  return data;
}

export async function deleteEmailTemplate(
  id: string,
  logger: BaseLogger = defaultLogger
): Promise<void> {
  logger.debug({ id }, 'Deleting email template');
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    logger.error({ id, err: error }, 'Failed to delete email template');
    throw new AppError(`Failed to delete email template: ${error.message}`, 502);
  }
  logger.debug({ id }, 'Email template deleted successfully');
}

export async function renderEmailTemplate(
  id: string,
  fields: RenderFieldsInput,
  logger: BaseLogger = defaultLogger
): Promise<{ subject: string; body: string }> {
  logger.debug({ id }, 'Rendering email template');
  const template = await getEmailTemplate(id, logger);
  return {
    subject: renderTemplate(template.subject, fields),
    body: renderTemplate(template.body, fields),
  };
}
