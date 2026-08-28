import { createWriteStream, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const source = path.resolve('.output/chrome-mv3');
const targetDir = path.resolve('site/public/downloads');
const target = path.join(targetDir, 'stream-reader-compass-chrome.zip');
const archiveDate = new Date('2020-01-01T00:00:00Z');

if (!existsSync(source)) throw new Error('Build the extension before packaging it.');
mkdirSync(targetDir, { recursive: true });
if (existsSync(target)) rmSync(target);

await new Promise((resolve, reject) => {
  const output = createWriteStream(target);
  const archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', resolve);
  output.on('error', reject);
  archive.on('error', reject);
  archive.pipe(output);
  archive.directory(source, false, (entry) => ({ ...entry, date: archiveDate }));
  archive.finalize();
});

console.log(`Packaged ${target}`);
