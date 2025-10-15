import createHttpError from 'http-errors';
import UserCollection from '../models/user.js';
import bcrypt from 'bcrypt';

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
  return user;
};
