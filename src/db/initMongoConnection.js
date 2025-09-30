import mongoose from 'mongoose';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();

export async function initMongoConnection() {
  const MONGODB_USER = process.env.MONGODB_USER;
  const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
  const MONGODB_URL = process.env.MONGODB_URL;
  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/?retryWrites=true&w=majority&appName=Cluster0`;
  if (!uri) throw new Error('MONGO_URI is not set');

  // URI içinde db adı yoksa opsiyonla belirleyebilirsin:
  // await mongoose.connect(uri, { dbName: 'mydb' });
  await mongoose.connect(uri);

  console.log('✅ MongoDB connected to DB:', mongoose.connection.name);
}
