import { Router } from 'express';
import { upload } from '../middleware/upload';
import * as resumeController from '../controllers/resumeController';

const router = Router();

// POST /api/resume — Mac push script hits this on every export
router.post('/', upload.single('resume'), resumeController.uploadResume);

// GET /api/resume/meta — filename, size, uploaded_at (cheap, no signed URL)
router.get('/meta', resumeController.getResumeMeta);

// GET /api/resume/url — signed download URL, phone app fetches the PDF from here
router.get('/url', resumeController.getResumeUrl);

export default router;
