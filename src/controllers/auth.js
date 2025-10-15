import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const userData = req.body;
  const data = await registerUser(userData);
  res.status(201).send({
    message: 'BAŞARILI',
    durum: 201,
    data,
  });
};
