import createHttpError from 'http-errors';
import UserCollection from '../models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from '../constants/index.js';
import SessionCollection from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
  const { email, password } = userData;
  const userCheck = await UserCollection.findOne({ email });
  if (userCheck) throw createHttpError(409, 'Bu email hali hazırda mevcut');

  userData.password = await bcrypt.hash(password, 10);
  const user = await UserCollection.create(userData);
  return user;
};

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'Kullanıcı Bulunamadı');

  const passCheck = await bcrypt.compare(password, user.password);
  if (!passCheck) throw createHttpError(400, 'Şifre Yanlış');

  await SessionCollection.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64url');
  const refreshToken = randomBytes(30).toString('base64url');
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_TIME);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_TIME);

  const sessionData = await SessionCollection.create({
    userId: user._id,
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
  if (!oldSession) throw createHttpError(401, 'Invalid refresh token');

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
  if (!sessionId) return;
  await SessionCollection.findByIdAndDelete(sessionId);
};

export const resetMail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'Kullanıcı Bulunamadı');

  const resetToken = jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );

  // ⚠️ Test için jsonTransport önerisi: sendMail utils'inde açıklama var
  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;

  await sendMail({
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Şifre Sıfırlama',
    html: `<h1>Merhaba</h1><p>Şifre sıfırlama işlemi için aşağıdaki linke tıklayın.</p><p><a href="${resetUrl}">Şifre Sıfırla</a></p>`,
  });

  return true;
};

export const resetPwd = async (token, password) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Invalid or expired token');
  }

  const userId = decodedToken.sub;
  const userMail = decodedToken.email;

  const user = await UserCollection.findOne({ _id: userId, email: userMail });
  if (!user) throw createHttpError(404, 'Kullanıcı bulunamadı');

  const passCrypt = await bcrypt.hash(password, 10);
  await UserCollection.findByIdAndUpdate(userId, { password: passCrypt });

  return true;
};
