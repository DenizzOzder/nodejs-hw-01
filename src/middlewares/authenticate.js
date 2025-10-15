import createError from 'http-errors';
import SessionCollection from '../models/session.js';
import UserCollection from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const [scheme, token] = auth.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createError(401, 'Authorization header missing or malformed');
    }

    const session = await SessionCollection.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Invalid access token');
    }

    // Süre kontrolü
    if (session.accessTokenValidUntil <= new Date()) {
      // İsteğe bağlı: süresi dolmuş oturumu temizle
      await SessionCollection.deleteOne({ _id: session._id });
      throw createError(401, 'Access token expired');
    }

    // Kullanıcıyı yükle ve isteğe ekle
    const user = await UserCollection.findById(session.userId);
    if (!user) {
      // Yetkisiz kalmış session'ı temizlemek mantıklı
      await SessionCollection.deleteOne({ _id: session._id });
      throw createError(401, 'User not found for this token');
    }

    req.user = user; // -> controllers/services: req.user._id
    next();
  } catch (err) {
    next(err);
  }
};
