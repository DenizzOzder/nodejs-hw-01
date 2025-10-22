import createHttpError from 'http-errors';
import UserCollection from '../models/user.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../models/session.js';

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const userCheck = await UserCollection.findOne({ email });
  /* Kontrol */
  if (userCheck) {
    throw createHttpError(409, 'Bu email hali hazırda mevcut');
  }
  const passCrypt = await bcrypt.hash(password, 10);
  userData.password = passCrypt;
  const user = await UserCollection.create(userData);
  return user;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'Kullanıcı Bulunamadı');
  }
  const passCheck = await bcrypt.compare(password, user.password);
  if (!passCheck) {
    throw createHttpError(400, 'Şifre Yanlış');
  }

  await SessionCollection.deleteMany({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_TIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_TIME);

  const sessionData = await SessionCollection.create({
    userId: user.id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  return sessionData;
};
export const refreshSession = async (refreshTokenFromCookie) => {
  const oldSession = await SessionCollection.findOne({
    refreshToken: refreshTokenFromCookie,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Invalid refresh token');
  }
  await SessionCollection.deleteOne({ _id: oldSession._id });
  const accessToken = randomBytes(30).toString('base64url');
  const refreshToken = randomBytes(30).toString('base64url');

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_TIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_TIME);
  await SessionCollection.create({
    userId: oldSession.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};
export const logoutUser = async (sessionId) => {
  await SessionCollection.findByIdAndDelete(sessionId);
};
export const resetMail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetUrl = `${
    process.env.APP_DOMAIN
  }/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password reset',
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password (valid for 5 minutes):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      `,
    });
  } catch (_e) {
    console.error('SMTP ERROR:', e?.message, e?.code, e?.response);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  return true;
};

export const resetPwd = async (token, newPassword) => {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_e) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const { email } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await UserCollection.updateOne(
    { _id: user._id },
    { $set: { password: hash } },
  );

  await SessionCollection.deleteMany({ userId: user._id });

  return true;
};
