import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resetMail,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const userData = req.body;
  const data = await registerUser(userData);
  res.status(201).send({
    message: 'BAŞARILI',
    durum: 201,
    data,
  });
};

export const loginUserController = async (req, res) => {
  const userData = req.body;
  const session = await loginUser(userData);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).send({
    mesaj: 'Access Token',
    data: session,
  });
};
export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;
  await logoutUser(sessionId);
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(200).send({
    message: 'Successfully Logout',
    status: 200,
  });
};

export const refreshSessionController = async (req, res) => {
  // Cookie'den refresh token al
  const rt = req.cookies?.refreshToken;
  if (!rt) {
    throw createError(401, 'Refresh token is missing');
  }
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
};

export const resetMailController = async (req, res) => {
  const { email } = req.body;
  const sonuc = await resetMail(email);
  if (sonuc) {
    res.status(200).send({
      message: 'Mail Successfully Send',
      status: 200,
    });
  } else {
    res.status(404).send({
      message: 'Mail invalid',
      status: 404,
    });
  }
};

export const resetpwdController = async (req, res) => {
  const { token, password } = req.body;

  res.status(200).send({
    message: 'Şifre Güncellendi',
    status: 200,
  });
};
