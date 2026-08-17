import { Router } from 'express';
import * as coverLetterController from '../controllers/coverLetterController';

const router = Router();

router.get('/', coverLetterController.list);
router.get('/:id', coverLetterController.getOne);
router.post('/', coverLetterController.create);
router.put('/:id', coverLetterController.update);
router.delete('/:id', coverLetterController.remove);
router.post('/:id/render', coverLetterController.render);

export default router;
