import UserCollection from '../models/user.js';

export const registerUser = async (userData) => {
  const user = await UserCollection.create(userData);
  return user;
};
