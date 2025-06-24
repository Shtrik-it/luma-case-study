import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  use: {
    baseURL: 'https://magento.softwaretestingboard.com/',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          slowMo: 1000,
        },
      },
    },
  ],
});
