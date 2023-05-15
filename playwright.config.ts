import { PlaywrightTestConfig } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

dotenvConfig({ path: resolve(__dirname, '.env'), override: true });

const config: PlaywrightTestConfig = {
  // Timeout
  timeout: 40000,

  use: {
    // Browser options
    headless: true,

    // Context options
    viewport: { width: 1280, height: 720 },

    // Artifacts
    screenshot: 'only-on-failure',
    baseURL: "https://dev.sergek.kz/api/main/v2",
    ignoreHTTPSErrors: true,
    channel: "chrome",

    video: "retry-with-video",
  },

  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
 
  ],
  reporter: [["dot"], ["json", { outputFile: "test-result.json" }],['experimental-allure-playwright']],
  //reporter:"allure-playwright",
  retries: 0,
};

export default config;