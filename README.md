# chrisgarlick.com

Personal portfolio site built on Kritano CMS + Astro.

## Local Development

```bash
bun run dev          # Start dev server (CMS + Astro)
```

## Deploy to Server

SSH into the server and run from `/var/www/chrisgarlick`:

```bash
git pull origin main
bun update @kritano/cms        # pull latest CMS (if updated)
bun install                    # install any new deps
bun run build                  # rebuild Astro frontend
bun run start                  # restart the CMS server
```

The CMS server runs on port 3005. Nginx proxies `/api/` and `/admin` to it and serves the Astro static files from `dist/client`.

### Restarting the CMS process

If the CMS is already running, kill it first:

```bash
pkill -f "bun run ./node_modules/@kritano/cms/server.ts"
bun run start &                # start in background
```

Or as a one-liner:

```bash
pkill -f "bun run" && bun run start &
```

### Full redeploy (copy-paste)

```bash
cd /var/www/chrisgarlick
git pull origin main
bun install
bun run build
pkill -f "bun run" && bun run start &
```

## Scripts

| Command            | What it does                        |
|--------------------|-------------------------------------|
| `bun run dev`      | Local dev server                    |
| `bun run build`    | Build Astro frontend (`cms build`)  |
| `bun run start`    | Start CMS server (port 3005)       |
| `bun run migrate`  | Run CMS database migrations        |
| `bun run generate` | Generate CMS types                  |

## Environment Variables

Set in `.env` on the server:

| Variable          | Purpose                                      |
|-------------------|----------------------------------------------|
| `DATABASE_URL`    | PostgreSQL connection string                  |
| `REDIS_URL`       | Redis connection string                       |
| `JWT_SECRET`      | Auth token signing                            |
| `RESEND_API_KEY`  | Resend email API key (kritano.com domain)     |
| `EMAIL_FROM`      | Sender address for form emails                |
| `CONTACT_EMAIL`   | Default recipient for form submissions        |
| `CMS_API_URL`     | CMS API base URL (used at build time)         |
| `API_KEY`         | CMS API key                                   |

## Architecture

- **Astro** builds to static HTML in `dist/client` (served by nginx)
- **Kritano CMS** runs as a Node/Bun server on port 3005
- **Nginx** serves static files and proxies `/api/`, `/admin` to CMS
- **Forms** submit to `/api/forms/submit` (handled by CMS, sends via Resend)
