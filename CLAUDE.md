# testcases-trial

A shopping list: a Node HTTP server (`src/server.js`) serving one page (`public/index.html`) and a JSON API over an in-memory list (`src/items.js`). No dependencies at runtime.

## Commands

- `npm ci`: install. It also points git at `.githooks/`.
- `npm run check`: the unit tests, `node --test` over `src/**/*.test.js`.
- `npm run e2e`: the end-to-end tests, Playwright under `e2e/`. It starts the server itself on `E2E_PORT` (default 4173), so it needs no stack brought up first.
- The pre-commit hook runs the unit tests a commit touches.

## Agent skills

### Issue tracker

Issues live in this repository's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

None kept: this repository has no `CONTEXT.md` and no decision records.
