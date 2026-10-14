import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createList } from "./items.js";

const list = createList();
const page = new URL("../public/index.html", import.meta.url);

async function body(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function json(res, status, value) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(value));
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      return res.end(await readFile(page));
    }
    if (req.url === "/api/items" && req.method === "GET") {
      return json(res, 200, list.all());
    }
    if (req.url === "/api/items" && req.method === "POST") {
      const result = list.add((await body(req)).name);
      return result.error ? json(res, 400, result) : json(res, 201, result.item);
    }
    json(res, 404, { error: "Not found" });
  } catch {
    json(res, 400, { error: "Bad request" });
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
