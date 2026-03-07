import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './testsprite_tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});
