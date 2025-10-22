/* File Creater if doesnt exist */

import fs from 'node:fs/promises';

export const fileCreater = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(path);
    }
  }
};
