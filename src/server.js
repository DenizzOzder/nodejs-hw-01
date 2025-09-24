import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { initMongoConnection } from './db/initMongoConnection.js';
import {
  getContactsController,
  getContactByIdController,
} from './controllers/contactsController.js';

dotenv.config();

export async function setupServer() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Health check
  app.get('/', (_req, res) => {
    res.json({ message: 'Server is running!' });
  });

  // Contacts routes
  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController);

  // 404
  app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

  // Global error handler
  app.use((err, req, res, _next) => {
    req.log?.error?.(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  // DB -> Server
  await initMongoConnection();

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });

  return app;
}
