import {defineConfig,devices} from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname,'.env')});

export default defineConfig({
  testDir:'./tests',
  fullyParallel:true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
   ?[['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },
  
    projects: [
    // 1. Logs in through the API once and saves .auth/user.json
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: process.env.API_URL },
    },

    // 2. API tests: no browser, talks to the API URL
    {
      name: 'api',
      testDir: './tests/api',
      dependencies: ['setup'],
      use: { baseURL: process.env.API_URL },
    },

    // 3. UI tests: Chromium, starts logged out
    {
      name: 'ui',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'] },
    },

    // 4. E2E tests: Chromium, starts already logged in
    {
      name: 'e2e',
      testDir: './tests/e2e',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
    },
  ],

});