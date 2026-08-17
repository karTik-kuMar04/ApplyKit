# resume-sync-backend

Express + TypeScript API in front of Supabase. Handles the resume sync (Mac push, phone pull), plus CRUD and field-rendering for cover letter and email templates.

## Stack

- **Express 5** — routing
- **TypeScript 7** (`module`/`moduleResolution: Node16` — required together as of TS7)
- **tsx** — dev reload with fast native ESM execution, no manual build step while iterating
- **Pino** — high-performance structured logger (`pino-http` for request logging, `pino-pretty` for dev colorization)
- **@supabase/supabase-js** — storage + Postgres, using the **service role key** (server-side only, bypasses RLS)
- **multer** — in-memory file upload, streamed straight to Supabase Storage
- **cors**, **axios** (available for any future outbound calls; nothing calls it yet)

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Supabase project's URL + service role key
npm run dev             # tsx watch, restarts on save
```

`SUPABASE_SERVICE_ROLE_KEY` comes from your Supabase project's **Settings > API**. This key has full access and bypasses Row Level Security — it must only ever live in this backend's `.env`, never in the Expo app.

## Logging

Structured logging is provided by **Pino**:
- **Log Level**: Controlled by `LOG_LEVEL` environment variable. Defaults to `debug` in development (`NODE_ENV === 'development'`) and `info` in production (`NODE_ENV === 'production'`).
- **Formatting**: Pretty-printed and colorized in development via `pino-pretty` (info: green, warn: yellow, error/fatal: red, debug: blue). Output as compact JSON in production for log aggregators (Datadog, Loki, CloudWatch, ELK).
- **Request Correlation**: `pino-http` automatically tracks requests and generates or propagates an `x-request-id` header across log lines for a request.
- **Redaction**: Sensitive fields (`authorization` headers, `cookie`/`set-cookie`, `SUPABASE_SERVICE_ROLE_KEY`, and request body `body`/`subject` fields) are automatically redacted using Pino's `redact` config. Note: Path-based redaction targets specific object paths, so controllers/services log identifiers (e.g. template ID, file path) rather than full payload bodies.

## Supabase setup

**1. Storage bucket** — create a bucket named `resumes` (or match whatever you set `RESUME_BUCKET` to) in the Supabase dashboard. Private is fine — the backend serves it via short-lived signed URLs, not public access.

**2. Tables** — run this in the Supabase SQL editor:

```sql
create table resume_meta (
  id text primary key,
  file_path text not null,
  original_filename text not null,
  uploaded_at timestamptz not null,
  size_bytes integer not null
);

create table cover_letter_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

No RLS policies are required for these tables since the backend talks to Supabase exclusively with the service role key, which bypasses RLS. If you later let the Expo app query Supabase directly with an anon key, you'll want RLS policies then.

**3. Free tier note** — Supabase free projects auto-pause after 7 days with no requests. A scheduled GitHub Action pinging `/health` (or any Supabase endpoint) every few days prevents this from silently breaking sync.

## API

All routes are prefixed `/api`. Errors return `{ "error": "message" }` with an appropriate status code.

### Resume

| Method | Path | Description |
|---|---|---|
| POST | `/resume` | Multipart upload, field name `resume`, PDF only, max 10MB. Overwrites the current resume. Called by the Mac push script. |
| GET | `/resume/meta` | Filename, size, upload timestamp — cheap, no signed URL generated. |
| GET | `/resume/url` | Signed download URL (10 min expiry). Phone app fetches the PDF directly from Supabase using this. |

### Cover letters — `/cover-letters`

Standard CRUD (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`), plus:

| Method | Path | Description |
|---|---|---|
| POST | `/cover-letters/:id/render` | Body: `{ "company": "...", "role": "...", "hiring_manager": "..." }`. Returns `{ "rendered": "..." }` with `{{field}}` placeholders substituted. Unmatched placeholders are left as-is rather than becoming blank/undefined. |

### Email templates — `/email-templates`

Same CRUD shape, plus:

| Method | Path | Description |
|---|---|---|
| POST | `/email-templates/:id/render` | Same field body. Returns `{ "subject": "...", "body": "..." }`, both rendered — feed straight into `expo-mail-composer`. |

## Project structure

```
src/
  config/       env loading + validation, logger configuration, Supabase client
  types/        shared interfaces
  middleware/   error handling, request logging (pino-http), multer upload config
  services/     Supabase queries, template rendering — uses req.log or default logger
  controllers/  thin req/res layer, passes req.log to services
  routes/       URL -> controller wiring
  app.ts        Express app assembly (no listen — importable for tests)
  server.ts     entry point, calls app.listen
```

## Scripts

- `npm run dev` — tsx watch, restarts on file change
- `npm run build` — compiles to `dist/`
- `npm start` — runs the compiled build (`dist/server.js`)
- `npm run typecheck` — `tsc --noEmit`, useful in CI
