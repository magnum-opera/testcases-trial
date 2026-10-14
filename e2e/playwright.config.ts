import { defineConfig, devices } from "@playwright/test";

// E2E_PORT lets two runs share a machine.
const port = Number(process.env.E2E_PORT ?? 4173);

export default defineConfig({
  testDir: "./tests",
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "node src/server.js",
    cwd: "..",
    env: { PORT: String(port) },
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
  },
});
