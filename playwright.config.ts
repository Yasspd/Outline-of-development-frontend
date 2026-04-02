import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3180',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run seed && npm run start',
      cwd: '../Outline-of-development-backend',
      url: 'http://localhost:3081/api/health',
      reuseExistingServer: true,
      timeout: 180000,
    },
    {
      command: 'npm run build && npm run start',
      cwd: '.',
      url: 'http://localhost:3180/login',
      reuseExistingServer: true,
      timeout: 180000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
