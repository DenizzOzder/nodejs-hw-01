import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/contact.js';
import AuthRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.js';
import { UPLOADS_FOLDER } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export async function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.get('/', (_req, res) => {
    res.json({ message: 'Server is running!' });
  });

  app.use('/contacts', authenticate, router);
  app.use('/auth', AuthRouter);
  app.use('/uploads', express.static(UPLOADS_FOLDER));
  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);
  app.use(errorHandler);

  await initMongoConnection();

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });

  return app;
}
