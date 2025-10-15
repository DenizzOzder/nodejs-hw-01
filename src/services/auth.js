import createHttpError from 'http-errors';
import UserCollection from '../models/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { ACCESS_TOKEN_TIME, REFRESH_TOKEN_TIME } from '../constants/index.js';
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
