import { Request, Response } from 'express';
import { asyncHandler, AppError, param } from '../middleware/errorHandler';
import * as coverLetterService from '../services/coverLetterService';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const templates = await coverLetterService.listCoverLetters(req.log);
  res.json(templates);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const template = await coverLetterService.getCoverLetter(param(req, 'id'), req.log);
  res.json(template);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, body } = req.body;
  if (!name || !body) {
    throw new AppError('"name" and "body" are required', 400);
  }
  const template = await coverLetterService.createCoverLetter(name, body, req.log);
  res.status(201).json(template);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, body } = req.body;
  const template = await coverLetterService.updateCoverLetter(param(req, 'id'), { name, body }, req.log);
  res.json(template);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await coverLetterService.deleteCoverLetter(param(req, 'id'), req.log);
  res.status(204).send();
});

export const render = asyncHandler(async (req: Request, res: Response) => {
  const rendered = await coverLetterService.renderCoverLetter(param(req, 'id'), req.body ?? {}, req.log);
  res.json({ rendered });
});
