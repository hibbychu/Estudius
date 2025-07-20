import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwind from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  // If you want to build both frontend and main in one config, you can conditionally build main here.
  // Or keep separate configs (recommended) for frontend and main.

  // Here is a config focused on building Electron main process:
  if (mode === 'electron-main') {
    return {
      build: {
        target: 'node16',
        outDir: 'dist-electron',
        lib: {
          entry: path.resolve(__dirname, 'electron/main.ts'),
          formats: ['cjs'],
          fileName: () => 'main.js',
        },
        rollupOptions: {
          external: ['electron', 'path'], // exclude Node built-ins & electron from bundling
        },
        sourcemap: true,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    };
  }

  // Default frontend React config
  return {
    plugins: [react(), tailwind()],
    root: './',
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
