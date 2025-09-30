import createError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // http-errors ile üretilmiş bir hata mı?
  if (createError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
