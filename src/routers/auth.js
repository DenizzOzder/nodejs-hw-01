import { Router } from 'express';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  resetMailController,
  resetpwdController,
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
AuthRouter.post('/logout', controllerWrapper(logoutUserController));
AuthRouter.post('/refresh', controllerWrapper(refreshSessionController));
export default AuthRouter;

AuthRouter.post('/send-reset-email', controllerWrapper(resetMailController));

AuthRouter.post('/reset-pwd', controllerWrapper(resetpwdController));
