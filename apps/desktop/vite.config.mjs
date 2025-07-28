import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwind from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  // Config for Electron’s main process build:
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
          external: ['electron', 'path'],
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

  // Default (frontend) config:
  return {
    plugins: [react(), tailwind()],
    root: './',
    // ADD THIS LINE:
    base: './',    // <--- Relative asset path for Electron file://
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
