import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(contact, { abortEarly: false });
    next();
  } catch (error) {
    throw createHttpError(
      400,
      error.details.map((err) => err.message).join('--'),
    );
  }
};
