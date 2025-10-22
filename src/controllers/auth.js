import createError from 'http-errors';
import {
  resetMail,
  resetPwd,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

export const resetMailController = async (req, res, next) => {
  try {
    await resetMail(req.body.email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

export const resetpwdController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPwd(token, password);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// Aşağıdakiler senin mevcut akışın için burada dursun (değiştirmedim):

export const registerUserController = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    res.status(201).send({ message: 'BAŞARILI', durum: 201, data });
  } catch (err) {
    next(err);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).send({ mesaj: 'Access Token', data: session });
  } catch (err) {
    next(err);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies || {};
    if (sessionId) await logoutUser(sessionId);
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.status(200).send({ message: 'Successfully Logout', status: 200 });
  } catch (err) {
    next(err);
  }
};

export const refreshSessionController = async (req, res, next) => {
  try {
    const rt = req.cookies?.refreshToken;
    if (!rt) throw createError(401, 'Refresh token is missing');

    const { accessToken, refreshToken, refreshTokenValidUntil } =
      await refreshSession(rt);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};
