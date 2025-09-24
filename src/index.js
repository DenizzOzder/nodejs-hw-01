import { setupServer } from './server.js';

setupServer().catch((err) => {
  console.error('Server start failed:', err);
  process.exit(1);
});
