import mongoose from 'mongoose';

export async function initMongoConnection() {
  const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_URL, // ör: cluster0.w4mesct.mongodb.net (protocol YOK)
    MONGODB_DB, // ör: contact
  } = process.env;

  // Anlaşılır kontroller
  if (!MONGODB_URL) throw new Error('MONGODB_URL is missing (got undefined).');
  if (!MONGODB_DB) throw new Error('MONGODB_DB is missing.');
  if (!MONGODB_USER) console.warn('[Mongo] WARN: MONGODB_USER is empty');
  if (!MONGODB_PASSWORD)
    console.warn('[Mongo] WARN: MONGODB_PASSWORD is empty');

  // Kullanıcı/parolayı güvenli encode et
  const user = encodeURIComponent(MONGODB_USER || '');
  const pass = encodeURIComponent(MONGODB_PASSWORD || '');

  // SRV URI
  const uri = `mongodb+srv://${user}:${pass}@${MONGODB_URL}/?retryWrites=true&w=majority`;

  // Teşhis (parolasız)
  console.log(
    '[Mongo] Connecting -> host:',
    MONGODB_URL,
    'db:',
    MONGODB_DB,
    'user:',
    MONGODB_USER ? '***' : '<empty>',
  );

  // dbName'i burada ver (URI’de yoksa)
  await mongoose.connect(uri, { dbName: MONGODB_DB });

  console.log('✅ MongoDB connected. DB:', mongoose.connection.name);
}
