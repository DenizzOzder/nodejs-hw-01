import createError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // tüm hataları topla
    stripUnknown: true, // şemada olmayanları at
  });

  if (error) {
    // Joi hatasını işaretle ve details'ı taşı
    const err = createError(400, 'Validation error');
    err.isJoi = true;
    err.details = error.details;
    return next(err);
  }

  req.body = value;
  next();
};
