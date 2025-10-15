import { Router } from 'express';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUser } from '../validators/users.js';
import controllerWrapper from '../utils/ctrlWrapper.js';

const AuthRouter = Router();

AuthRouter.post(
  '/register',
  validateBody(registerUser),
  controllerWrapper(registerUserController),
);
export default AuthRouter;
