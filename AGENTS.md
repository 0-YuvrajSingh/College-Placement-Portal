# AGENTS.md

MERN campus-recruitment portal. Two independent npm packages with **no root tooling, no workspaces**: `server/` (Express + Mongoose, **CommonJS**) and `frontend/` (Vite + React 19 + TS + Tailwind v4, **ESM**). All commands below must run from inside that package's directory.

## Commands

### server/
- `npm run dev` — nodemon on :5000 (requires MongoDB + `.env`; copy `.env.example` → `.env`, set `JWT_SECRET`)
- `npm run seed` — **destructive**: clears all collections, then recreates demo data (see README for demo accounts)
- `npm test` — Jest + Supertest, `--runInBand`; **requires a running MongoDB**, uses `placement_portal_test` DB and drops it in `beforeEach` (never run against dev data). Single file: `npm test -- tests/jobs.test.js`
- If no local MongoDB, run one via Docker: `docker run -d --name pf-mongo -p 27017:27017 mongo:7` (stop/remove with `docker rm -f pf-mongo`)
- `npm start` — plain node (no reload)

### frontend/
- `npm run dev` — Vite on :5173, proxies `/api` → `http://localhost:5000`, so the backend must also be running
- `npm run build` — `tsc --noEmit && vite build`; **this is the typecheck command**
- `npm run lint` — `oxlint` (not ESLint); `npm run format` — `oxfmt` (not Prettier)
- No frontend test suite. `@playwright/test` is installed but **unconfigured** (no config file, no tests) — don't invent one.

## Architecture

- Entry: `server/server.js` (DB connect + listen) and `server/app.js` (middleware + route mounts + error handlers). `app.js` exports the Express app, which supertest imports directly.
- Route prefixes (see `app.js`): `/api/auth`, `/api/students`, `/api/recruiter`, `/api/jobs`, `/api/student/applications`, `/api/admin`, `/api/stats`, `/api/docs` (Swagger UI). All list endpoints are paginated.
- Layering: `routes` → `controllers` → `services` (business logic incl. `eligibility.service.js`), plus `models`, `validators` (express-validator), `middleware`, `config/constants.js`, `utils/`.
- **`server/config/constants.js` is the single source of truth** for roles, departments, and job/application status enums **and their allowed transitions** (`APPLICATION_TRANSITIONS`, `JOB_TRANSITIONS`). Update both when changing statuses.
- API envelope is `{ success: true, data }` / `{ success: false, message, code }`; pagination lives under `pagination`. Use `utils/ApiError` + `utils/asyncHandler` in handlers.
- Auth: JWT via `protect` + `requireRole(...)` middleware (`server/middleware/authMiddleware.js`); rate limiters are disabled when `NODE_ENV=test`.
- Frontend: JWT stored in localStorage under `pf_token`; axios wrapper `frontend/src/lib/api.ts` (`http` helper unwraps `{ success, data }` — new API functions should use it). Role-protected routes are declared in `src/App.tsx` via `<Protected role=...>`.
- Path alias `@/*` → `frontend/src/*`. Tailwind v4: no `tailwind.config`, global styles live in `src/index.css`.

## Gotchas

- `server` files must use `require()`; `frontend` uses `import`. Don't add `"type": "module"` to the server.
- `npm run seed` wipes the DB — never run against a shared environment.
- `UI Design/` is an approved Figma design reference (static mock), not part of the running app.
- `.gitattributes` routes many file types through Git LFS; uploaded resumes in `server/uploads/` are gitignored.
- `npm run format` uses `oxfmt`. Do **not** run it blindly on the current frontend codebase: the formatter has been observed to corrupt valid inline TypeScript object type literals. `npm run lint` and `npm run build` remain the authoritative frontend verification commands. If formatting is required, inspect the diff immediately and revert any formatter-induced type-syntax changes before committing.
