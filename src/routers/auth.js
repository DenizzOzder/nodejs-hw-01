import { Router } from 'express';
import {
  loginUserController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUser, registerUser } from '../validators/users.js';
import controllerWrapper from '../utils/ctrlWrapper.js';

const AuthRouter = Router();

AuthRouter.post(
  '/register',
  validateBody(registerUser),
  controllerWrapper(registerUserController),
);
AuthRouter.post(
  '/login',
  validateBody(loginUser),
  controllerWrapper(loginUserController),
);
export default AuthRouter;
