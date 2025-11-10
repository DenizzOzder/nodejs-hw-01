// ES Modules
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname eşdeğeri (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// docs/swagger.json yolunu çöz
const swaggerJsonPath = path.resolve(
  __dirname,
  '../..',
  'docs',
  'swagger.json',
);

export function swaggerDocs() {
  // JSON'u oku
  const raw = fs.readFileSync(swaggerJsonPath, 'utf8');
  const swaggerDocument = JSON.parse(raw);

  // swagger-ui-express, Express middleware dizisi döndürebilir
  return [
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true }),
  ];
}
