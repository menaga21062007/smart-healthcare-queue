import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'dist');
const target1 = path.join(__dirname, '../backend/frontend/dist');
const target2 = path.join(__dirname, '../backend/dist/frontend/dist');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursiveSync(srcDir, target1);
  copyRecursiveSync(srcDir, target2);
  console.log('✅ Copied frontend build dist to backend/frontend/dist and backend/dist/frontend/dist');
} catch (err) {
  console.error('Copy build warning:', err.message);
}
