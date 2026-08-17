import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import * as resumeService from '../services/resumeService';

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded. Send a PDF under field name "resume".', 400);
  }

  const meta = await resumeService.uploadResume(req.file.buffer, req.file.originalname, req.log);
  res.status(201).json(meta);
});

export const getResumeMeta = asyncHandler(async (req: Request, res: Response) => {
  const meta = await resumeService.getResumeMeta(req.log);
  if (!meta) {
    throw new AppError('No resume has been uploaded yet', 404);
  }
  res.json(meta);
});

export const getResumeUrl = asyncHandler(async (req: Request, res: Response) => {
  const url = await resumeService.getResumeDownloadUrl(req.log);
  res.json({ url });
});
