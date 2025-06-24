import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  retries: 1,
  workers: 1,
  use: {
    baseURL: 'https://magento.softwaretestingboard.com/',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
