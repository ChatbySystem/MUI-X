import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@mui/x-charts',
        replacement: new URL('./packages/x-charts/src', import.meta.url).pathname,
      },
      {
        find: '@mui/x-date-pickers',
        replacement: new URL('./packages/x-date-pickers/src', import.meta.url).pathname,
      },
      {
        find: 'test/utils',
        replacement: new URL('./test/utils', import.meta.url).pathname,
      },
      {
        find: '@mui/x-internals',
        replacement: new URL('./packages/x-internals/src', import.meta.url).pathname,
      },
    ],
  },
  test: {
    globals: true,
    setupFiles: ['test/setup.ts'],
  },
});
