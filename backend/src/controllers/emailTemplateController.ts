import { Request, Response } from 'express';
import { asyncHandler, AppError, param } from '../middleware/errorHandler';
import * as emailTemplateService from '../services/emailTemplateService';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const templates = await emailTemplateService.listEmailTemplates(req.log);
  res.json(templates);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const template = await emailTemplateService.getEmailTemplate(param(req, 'id'), req.log);
  res.json(template);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, subject, body } = req.body;
  if (!name || !subject || !body) {
    throw new AppError('"name", "subject", and "body" are required', 400);
  }
  const template = await emailTemplateService.createEmailTemplate(name, subject, body, req.log);
  res.status(201).json(template);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, subject, body } = req.body;
  const template = await emailTemplateService.updateEmailTemplate(
    param(req, 'id'),
    {
      name,
      subject,
      body,
    },
    req.log
  );
  res.json(template);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await emailTemplateService.deleteEmailTemplate(param(req, 'id'), req.log);
  res.status(204).send();
});

export const render = asyncHandler(async (req: Request, res: Response) => {
  const rendered = await emailTemplateService.renderEmailTemplate(
    param(req, 'id'),
    req.body ?? {},
    req.log
  );
  res.json(rendered);
});
