import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = path.resolve('assets/src/hero-editorial.png');
const output = path.resolve('site/public/assets');
await mkdir(output, { recursive: true });

for (const width of [600, 1200]) {
  const image = sharp(source).resize({ width, withoutEnlargement: true });
  await Promise.all([
    image.clone().avif({ quality: 55, effort: 5 }).toFile(path.join(output, `hero-editorial-${width}.avif`)),
    image.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(output, `hero-editorial-${width}.webp`)),
    image.clone().jpeg({ quality: 82, progressive: true }).toFile(path.join(output, `hero-editorial-${width}.jpg`))
  ]);
}

await sharp(source)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .webp({ quality: 80, effort: 5 })
  .toFile(path.join(output, 'social-preview.webp'));

console.log('Optimized responsive hero and social images.');
