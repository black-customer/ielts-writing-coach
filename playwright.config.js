// playwright.config.js — E2E 配置：本地用系统 Edge（免下载浏览器），CI 用 chromium
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "models/e2e-report" }]],
  use: {
    baseURL: "http://127.0.0.1:8123",
    headless: true,
    channel: process.env.CI ? undefined : "msedge",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: [
    { command: "python -m http.server 8123 --directory tool", port: 8123, reuseExistingServer: true, timeout: 30_000 },
    { command: "python -m http.server 8200 --directory dist", port: 8200, reuseExistingServer: true, timeout: 30_000 },
  ],
  projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }],
});
