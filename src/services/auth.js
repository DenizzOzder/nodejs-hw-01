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
