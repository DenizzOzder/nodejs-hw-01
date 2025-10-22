import multer from 'multer';
import { TEMP_FOLDER } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, TEMP_FOLDER);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + ' - ' + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + ' - ' + file.originalname);
  },
});
export const upload = multer({ storage });
