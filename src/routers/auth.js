import express from 'express';
import {
  resetMailController,
  resetpwdController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailSchema, resetPwdSchema } from '../validators/auth.js';

const router = express.Router();

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  resetMailController,
);

router.post('/reset-pwd', validateBody(resetPwdSchema), resetpwdController);

export default router;
