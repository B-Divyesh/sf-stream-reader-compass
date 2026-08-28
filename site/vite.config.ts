import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve('site'),
  publicDir: path.resolve('site/public'),
  build: {
    outDir: path.resolve('dist/site'),
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        index: path.resolve('site/index.html'),
        '404': path.resolve('site/404.html')
      }
    }
  }
});
