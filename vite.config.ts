import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'Neuto',
      fileName: 'neuto',
    },
    rollupOptions: {
      external: ['gsap'],
      output: {
        globals: {
          gsap: 'gsap',
        },
      },
    },
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    includeSource: ['lib/**/*.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
  },
});
