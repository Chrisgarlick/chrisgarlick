# Kritano CMS — Issues & Improvements

Tracked during chrisgarlick.com build. Feed back to the CMS repo.

---

## Issues Found

### 1. Port conflict on restart (no graceful cleanup)
**Severity:** Medium
**Description:** When `bun run dev` exits (or crashes), ports 3005/3006 aren't released. Restarting requires manually killing processes. The dev command should either check for and kill existing processes on startup, or handle SIGTERM gracefully to release ports.

### 2. `use-sync-external-store` ESM/CJS issue (FIXED)
**Severity:** High (was blocking)
**Description:** Admin Vite dev server couldn't resolve CJS module `use-sync-external-store`. Fixed by switching to pre-built admin dist in dev mode. Good decision — consumers never edit admin code.

### 3. Missing `components/media/` directory (FIXED)
**Severity:** High (was blocking)
**Description:** `Media.tsx` imported from `@/components/media/MediaGrid`, `MediaUploader`, `MediaDetail`, `MediaPicker` — but the directory didn't exist. Was a `.gitignore` issue excluding the `media/` directory name.

### 4. `bun-types` not available for postinstall build
**Severity:** High (was blocking)
**Description:** When installed as a GitHub dependency, `devDependencies` aren't installed. The postinstall `build:assets` script needed `bun-types` and `typescript` which were in devDependencies. Fixed by moving them to `dependencies`.

### 5. `bun pm trust` required for postinstall
**Severity:** Low
**Description:** Bun blocks postinstall scripts by default for GitHub dependencies. Consumer must run `bun pm trust @kritano/cms` after first install. Consider documenting this in getting-started.md, or finding a way to auto-trust.

---

## Improvements / Suggestions

### 0. Theme directory hardcoded — no custom theme support
**Severity:** HIGH (blocking custom themes)
**Description:** `packages/cli/src/commands/dev.ts` line 123 hardcodes `const themeDir = resolve(cmsRoot, 'themes/default')`. There is no way for a consumer project to use their own Astro theme. The dev command always starts Astro from the default theme in node_modules. This makes the "Custom Theme" approach described in docs/themes.md impossible.
**Suggested fix:** Check if the consumer project root has an `astro.config.mjs` (or `src/pages/`). If so, use the project root as the theme dir. If not, fall back to the default theme. Something like:
```ts
const hasCustomTheme = existsSync(resolve(projectRoot, 'astro.config.mjs')) || existsSync(resolve(projectRoot, 'src/pages'))
const themeDir = hasCustomTheme ? projectRoot : resolve(cmsRoot, 'themes/default')
```

### 0b. Server reads CMS's own config, not project's
**Severity:** HIGH (blocking custom collections)
**Description:** `server.ts` line 2: `import config from './cms.config'` reads the config relative to the script file (inside node_modules), not the consumer's project config. The CLI's dev command correctly reads the project's `cms.config.ts` for migrations and type generation, but the API server registers routes only for the CMS package's own collections (page, article, project).
**Impact:** Custom collections (caseStudy, proofMetric) get database tables and types but NO API endpoints. This means themes can't fetch data from custom collections.
**Suggested fix:** Either:
1. `server.ts` should resolve config from `process.cwd()`: `import config from '${process.cwd()}/cms.config'`
2. Or the dev command should pass `CMS_CONFIG_PATH` env var and server.ts reads from that
3. Or the dev command should use a wrapper that imports the project config and passes it to `createServer()`

### 0d. Dev proxy does not handle WebSocket upgrade — causes infinite page reload loop
**Severity:** HIGH (performance, dev experience)
**Description:** The dev proxy (`Bun.serve` in dev.ts) doesn't handle WebSocket upgrade requests. Astro's Vite dev server uses WebSocket for HMR. When the browser connects through :3006, the WebSocket connection fails silently. Vite falls back to polling mode, which repeatedly requests the page — causing dozens of requests per second in the logs and visible flickering/slowness in the browser.
**Impact:** Dev server becomes slow, logs fill with repeated requests, pages flicker, and the dev process eventually crashes from the load.
**Suggested fix:** Add WebSocket upgrade handling in the proxy to forward `Upgrade: websocket` requests to the Astro dev server on :4321. Example:
```ts
// In Bun.serve options:
websocket: {
  open(ws) { /* connect to upstream Astro WS */ },
  message(ws, msg) { /* forward */ },
  close(ws) { /* cleanup */ },
},
// And handle upgrade in fetch:
if (req.headers.get('upgrade') === 'websocket') {
  server.upgrade(req)
}
```
**Workaround:** Browse the Astro dev server directly on http://localhost:4321 instead of the proxy on :3006. HMR works correctly on :4321. The only downside is /api/* routes won't proxy through, but for frontend development this is fine.

### 0c. Proxy routes ALL /api/* to CMS, blocking theme API routes
**Severity:** Medium
**Description:** The dev proxy routes all `/api/*` requests to the CMS API server. If a theme creates Astro API routes at `/api/*` (e.g., `/api/apply` for form handling), they're unreachable through the proxy. Workaround: use non-`/api/` paths for theme API routes (e.g., `/apply/submit`).
**Suggested fix:** Check if the CMS API returns 404 for a given `/api/*` route, and if so, fall back to the Astro frontend. Or allow the theme to register "passthrough" API paths in the config.

### 1. Custom API routes for themes
**Description:** No documented way to add custom Hono routes from a consumer project. The form API (`/api/apply`) needs to be an Astro API route instead of a Hono route because the Hono server is inside node_modules. Consider allowing `cms.config.ts` to register custom API routes that get mounted on the Hono server.

### 2. Theme documentation
**Description:** The `docs/themes.md` file exists but the getting-started.md doesn't reference it. A "Custom Themes" section in getting-started.md with a minimal example would help.

### 3. Collection types for SDK
**Description:** The SDK's `getCMSClient()` returns untyped collections — `cms.collection('article').findMany()` returns `any`. The type generation (`bun run generate`) creates types but there's no documented way to pass them to the SDK client for type-safe queries in themes.

### 3b. Blocks field returned as JSON string, not parsed array
**Severity:** Medium
**Description:** The `content` blocks field on the `page` collection is stored as JSONB but the REST API returns it as a JSON-encoded string rather than a parsed array. Theme templates need to `JSON.parse()` the content before iterating. This should be parsed server-side before returning.

### 3c. Admin block editor doesn't load existing blocks from saved data
**Severity:** HIGH
**Description:** When editing a page that has blocks saved via the API, the admin's BlockBuilder component shows "Add block" with no existing blocks loaded. The data is correctly stored in the database (verified via API — Home has 9 blocks, About has 3) and renders correctly on the frontend. But the admin editor doesn't hydrate the BlockBuilder with the existing block data. This means blocks created via API can't be edited in the admin UI.
**Impact:** Can't edit block content through the admin — only via API. Defeats the purpose of the visual block editor.
**Likely cause:** The DocumentEditor may not be passing the saved `content` field value to BlockBuilder's initial state, or BlockBuilder may expect the data in a different format than what the API stores.

### 3d. richText inside blocks not pre-rendered to HTML
**Severity:** HIGH
**Description:** Top-level richText fields get `.html` property pre-rendered by the CMS. But richText fields nested inside blocks only return the TipTap JSON structure (`type`, `content`) without the `.html` property. Theme templates using `set:html={body.html}` get nothing. This means block-based rich text content doesn't render.
**Suggested fix:** The API should recursively pre-render richText fields inside block `fields` objects, same as it does for top-level richText fields.

### 3d. API key publish fails with UUID error
**Severity:** Medium
**Description:** `POST /api/page/:id/publish` with API key auth fails: `invalid input syntax for type uuid: "apikey:5cfd..."`. The publish endpoint tries to use the API key identifier as the `published_by` user ID. API key auth needs to resolve to the associated user ID for publish operations.

### 4. `proofMetric` collection — no `sortOrder` support in API
**Status:** Untested — need to verify if `orderBy: { sortOrder: 'asc' }` works on custom number fields.

### 5. Astro integration package path
**Description:** Import path `@kritano/cms/astro` — need to verify this resolves correctly when CMS is installed as a GitHub dependency vs monorepo workspace. May need explicit `exports` field in CMS package.json.

### 6. Rich text HTML rendering
**Description:** The SDK returns `doc.body.html` for rich text fields. Need to verify this works correctly for all TipTap node types (headings, blockquotes, code blocks, images, links). Also need to confirm the HTML has no XSS vectors when rendered with `set:html`.

### 7. Dev proxy should handle 404 gracefully
**Description:** When the Astro frontend returns a 404, the dev proxy should pass through the custom 404 page rather than showing its own error.

### 8. No way for non-technical users to create collections from the admin UI
**Severity:** Medium (roadmap)
**Description:** Adding a new collection requires editing `cms.config.ts`, running `bun run migrate`, and running `bun run generate`. This is fine for developers but means non-technical CMS users can never create or modify content types without developer involvement.
**Options:**
1. **Admin UI collection builder** — visual interface in `/admin` to define fields, auto-generates migration and restarts. How Payload, Directus, and Strapi handle it. Big feature.
2. **Database-driven schemas** — store collection definitions in the DB, API reads them dynamically at runtime. More flexible but loses type safety.
3. **Keep code-first, document as managed service** — position collection creation as a developer task. Fine for agency/consultant model where the developer manages the CMS for clients. Simplest path short-term.

Option 1 is the long-term goal if Kritano CMS becomes a self-serve product. Option 3 is fine for now.

### 9. CLI should auto-run migrate + generate + build after schema changes
**Severity:** Medium (DX)
**Description:** After editing `cms.config.ts`, developers must manually run three commands in the correct order: `bun run migrate` → `bun run generate` → `bun run build`. This is error-prone and tedious — especially for non-technical users or when managing multiple sites.
**Suggested fix:** The CLI should offer a single command (e.g., `cms sync` or `cms apply`) that detects schema changes and runs the full pipeline: migrate → generate → build. Ideally `cms dev` should also watch `cms.config.ts` and auto-run migrate + generate on change, then trigger an Astro rebuild. This is how Payload CMS and Drizzle Kit handle it — schema changes are picked up automatically in dev mode.

### 10. `cms` CLI not available on production servers
**Severity:** High (DX)
**Description:** On production servers, the `cms` binary isn't on the PATH. Running `cms migrate` or `cms migrate:create` fails with "command not found". Have to use `npx cms` or `./node_modules/.bin/cms` instead. The CLI should either be registered as a `bin` in package.json so it's available after `bun install`, or docs should make the `npx` prefix clear for server usage.

### 11. `cms migrate` should auto-create migrations, not just apply them
**Severity:** High (DX)
**Description:** `cms migrate` only applies existing migration files — it does NOT generate new ones when the schema has changed. You have to know to run `cms migrate:create` first, then `cms migrate`. This is a confusing two-step process that looks like it worked (reports "no pending migrations") when the migration file simply doesn't exist yet. `cms migrate` should diff the schema against the database and auto-generate + apply any needed migrations in one step. The separate `migrate:create` command can remain for advanced use, but the default `migrate` should handle the common case.

**Reproduced 2026-05-12 on chrisgarlick.com:** added a new `resource` collection (and a `relatedResources` field on `article`) to `cms.config.ts`, pushed, ran `bun run generate` and `bun run migrate` on the production server. `generate` updated the types correctly (`6 collection(s): page, article, caseStudy, proofMetric, tool, resource`), but `migrate` reported `✓ No pending migrations` and the `resources` table never got created. The fix required `bun run migrate:create` (which had to be added to `package.json` because it wasn't wired into the scripts) and then `bun run migrate` again. This is the second time this trap has been hit — the user reasonably expected the schema change to flow through with the existing two commands. The "no pending migrations" message is actively misleading in this case: it should be "schema has uncommitted changes — run `migrate:create` first" at a minimum, or just do the right thing automatically.

**Also:** `migrate:create` should be auto-listed in the `package.json` `scripts` block by the CMS scaffolder, alongside `migrate` and `generate`. New projects don't get it without manual editing.

### 12. Email provider abstraction for form notifications
**Severity:** High (architecture)
**Description:** Form notification emails (`packages/core/src/lib/resend.ts`) are hardcoded to Resend. Not all CMS users will use Resend — some will need SMTP (nodemailer), SendGrid, Postmark, AWS SES, Mailgun, etc. The current implementation only works if the user has a Resend account and API key.
**Suggested fix:** Introduce a pluggable email transport layer:
- Define an `EmailTransport` interface with a `send()` method
- Ship built-in transports: Resend, SMTP (via nodemailer), console/log (dev default)
- Allow users to configure transport in `cms.config.ts`:
  ```ts
  email: {
    transport: 'resend',  // or 'smtp', 'sendgrid', etc.
    from: 'Name <noreply@example.com>',
  }
  ```
- SMTP transport reads standard env vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
- Resend transport reads `RESEND_API_KEY` (as now)
- Console transport (default when no provider configured) logs to stdout for local dev
- Third-party transports via plugins for SendGrid, Postmark, SES, etc.
- The `sendEmail()` function routes through whichever transport is configured — form submissions, password resets, and any future email features all use the same abstraction

### 14. Admin UI should ship pre-built — not rebuilt from source on every install (FIXED)
**Severity:** High (deployment / DX) — was blocking
**Description:** The `@kritano/cms` package rebuilt the admin UI from source on every consumer install via the `postinstall` `build:assets` script (`cd packages/admin && bun run build`). That build ran `tsc -b && vite build` on ~1,800 modules — heavy enough that on small VPS instances (1–2 GB RAM) it got killed by the OOM killer (exit 137 / SIGKILL). When that happened mid-build the `packages/admin/dist/` directory was left in a corrupted, half-written state. The consumer's `server.ts` saw files in `dist/` and decided "admin is built", so it routed `/admin` to a broken bundle that returned 500s or blank pages.

**Reproduced 2026-05-12 on chrisgarlick.com:** ran `bun run build && systemctl restart chrisgarlick` on a 2 GB VPS. The `cms build` step's admin Vite build hit OOM at ~1,842 modules transformed with `error: script "build" was terminated by signal SIGKILL (Forced quit) / Failed with exit code 137`. The frontend was fine, but `/admin` was unreachable afterwards because the admin dist was partial.

**Fix:** the admin UI is now compiled in the source repo before publish — the `@kritano/cms` package ships with a pre-built `packages/admin/dist/`. Consumer installs no longer trigger a Vite build on the target machine, so there's no OOM risk and no half-written-dist failure mode.

**Still open — knock-on:** `cms build` still rebuilds admin unconditionally even when the consumer only changes theme/frontend code. For a frontend-only deploy, the admin rebuild is wasted work and re-introduces the OOM risk on small servers (the consumer workaround is `bunx astro build`, which skips it). `cms build` should either skip admin when its source is unchanged (timestamp/hash check on `packages/admin/src/` vs the package's shipped `dist/`), or expose a `--frontend-only` flag, or simply not bundle the admin build into the default consumer build at all (consumers don't have the admin source to build from anyway, post-fix). Right now the rebuild path only makes sense inside the CMS repo itself.

### 13. Submissions tab missing from form builder admin UI
**Severity:** Medium
**Description:** The form builder (`packages/admin/src/pages/forms/FormBuilder.tsx`) has no way to view submissions. All backend API routes already exist (`GET /admin/forms/:id/submissions`, `DELETE /admin/forms/:id/submissions/:subId`, `GET /admin/forms/:id/export`) — this is purely a frontend addition.
**Suggested fix:** Add a "Submissions" tab to the form builder that:
- Lists submissions in a table (first 4 fields + submitted date)
- Supports pagination via the existing API
- Allows deleting individual submissions
- Includes CSV export button
- Shows empty state when no submissions exist

---

## Questions for CMS Development

1. Does `getCMSClient()` work from Astro pages when imported from `@kritano/cms/astro`? Or does it need to be `@kritano/cms/packages/astro`?
2. Does the sitemap integration work with the reverse proxy, or does Astro need to know its final URL?
3. Can the CMS serve static files from the theme's `public/` directory (e.g., `robots.txt`)?
4. How does preview mode work for draft content in the theme?
