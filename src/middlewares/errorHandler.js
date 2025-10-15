import createError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // 1) MongoDB duplicate key (ör. email benzersiz)
  if (err?.code === 11000 || err?.code === '11000') {
    return res.status(409).json({
      status: 409,
      message: 'Duplicate key',
      data: err.keyValue, // hangi alan çakışmış?
    });
  }

  // 2) Mongoose CastError (geçersiz ObjectId vb.)
  if (err?.name === 'CastError') {
    return res.status(400).json({
      status: 400,
      message: 'Invalid parameter',
      data: { path: err.path, value: err.value },
    });
  }

  // 3) Joi doğrulama hatası
  if (err?.isJoi) {
    const details = Array.isArray(err.details) ? err.details : [];
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      data: details.map((d) => d.message),
    });
  }

  // 4) http-errors ile oluşturulmuş mu?
  if (createError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  // 5) Diğer tüm hatalar
  const status = err.status || 500;
  return res.status(status).json({
    status,
    message: status === 500 ? 'Something went wrong' : err.message,

    data: err.message,
  });
};
