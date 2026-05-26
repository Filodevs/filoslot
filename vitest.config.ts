import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.angular'],
    server: {
      deps: {
        inline: ['primeng', '@primeuix/themes'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '.angular/',
        'src/test-setup.ts',
        'src/**/*.spec.ts',
        'src/**/__mocks__/**',
        'src/main.ts',
        'src/environments/**',
        '**/*.config.ts',
        '**/*.config.js',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@core': resolve(__dirname, './src/app/core'),
      '@shared': resolve(__dirname, './src/app/shared'),
      '@features': resolve(__dirname, './src/app/features'),
      '@models': resolve(__dirname, './src/app/models'),
      '@environments': resolve(__dirname, './src/environments'),
    },
  },
});
