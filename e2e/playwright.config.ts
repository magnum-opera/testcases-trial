import { defineConfig, devices } from "@playwright/test";

// Each test starts its own server on a free port: see fixtures.ts.
export default defineConfig({
  testDir: "./tests",
  retries: 0,
  reporter: [["list"]],
  use: { trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
