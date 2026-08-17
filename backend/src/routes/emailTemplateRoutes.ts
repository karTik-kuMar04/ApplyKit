import { Router } from 'express';
import * as emailTemplateController from '../controllers/emailTemplateController';

const router = Router();

router.get('/', emailTemplateController.list);
router.get('/:id', emailTemplateController.getOne);
router.post('/', emailTemplateController.create);
router.put('/:id', emailTemplateController.update);
router.delete('/:id', emailTemplateController.remove);
router.post('/:id/render', emailTemplateController.render);

export default router;
