import { test as base, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, () => {
      const { port } = probe.address() as { port: number };
      probe.close(() => resolve(port));
    });
  });
}

async function waitUntilUp(url: string, timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(`Server at ${url} did not answer within ${timeoutMs}ms`);
}

// The list lives in the server's memory with no way to clear it, so each test gets its own server.
export const test = base.extend({
  baseURL: async ({}, use) => {
    const port = await freePort();
    const server = spawn(process.execPath, ["src/server.js"], {
      cwd: root,
      env: { ...process.env, PORT: String(port) },
      stdio: "ignore",
    });
    const url = `http://localhost:${port}`;
    try {
      await waitUntilUp(url);
      await use(url);
    } finally {
      server.kill();
    }
  },
});

export { expect };
