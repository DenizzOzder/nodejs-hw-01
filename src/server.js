import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/contact.js';
import AuthRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate.js';

dotenv.config();

export async function setupServer() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  // Health check
  app.get('/', (_req, res) => {
    res.json({ message: 'Server is running!' });
  });

  //Routes
  app.use('/contacts', authenticate, router);
  app.use('/contacts', router);
  app.use('/auth', AuthRouter);

  // 404
  app.use(notFoundHandler);

  //ErrHandler
  app.use(errorHandler);

  // DB -> Server
  await initMongoConnection();

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });

  return app;
}
