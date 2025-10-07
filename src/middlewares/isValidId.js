import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw createHttpError(400, 'Hatalı ID');
  }
  next();
};
