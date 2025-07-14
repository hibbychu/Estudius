import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    target: 'node16',
    outDir: 'dist-electron',
    rollupOptions: {
      input: path.resolve(__dirname, 'electron/main.ts'),
      output: {
        format: 'cjs',
        entryFileNames: '[name].cjs',  // use .cjs extension here
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
