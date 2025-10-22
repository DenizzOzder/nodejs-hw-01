import createHttpError from 'http-errors';
import UserCollection from '../models/user.js';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/sendMail.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../models/session.js';

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
