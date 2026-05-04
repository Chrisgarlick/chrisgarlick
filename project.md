# Kritano Portfolio — Setup & Update Guide

**Your personal portfolio site built on Kritano CMS**
**CMS repo:** `github.com/Kritano/Kritano-cms`

-----

## Overview

Your portfolio is a separate project that uses the CMS as a dependency — not a clone of it. This means:

- CMS development happens in `github.com/Kritano/Kritano-cms`
- Your portfolio lives in its own repo (e.g. `github.com/Kritano/portfolio` or `github.com/Kritano/kritano.com`)
- When the CMS gets better, you pull the update via the admin UI — one button, no SSH required
- Your content, theme, and config are yours — CMS updates never touch them

-----

## Part 1 — Initial setup

### 1.1 Create your portfolio repo

```bash
mkdir kritano-portfolio && cd kritano-portfolio
git init
git remote add origin https://github.com/Kritano/kritano-portfolio.git
```

### 1.2 Set up `package.json`

```json
{
  "name": "kritano-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "cms dev",
    "build": "cms build",
    "migrate": "cms migrate"
  },
  "dependencies": {
    "@cms/core":  "github:Kritano/Kritano-cms#main",
    "@cms/admin": "github:Kritano/Kritano-cms#main",
    "@cms/astro": "github:Kritano/Kritano-cms#main",
    "@cms/sdk":   "github:Kritano/Kritano-cms#main",
    "@cms/cli":   "github:Kritano/Kritano-cms#main",
    "@cms/types": "github:Kritano/Kritano-cms#main"
  }
}
```

During active development the packages point at the `main` branch. Once the CMS publishes stable releases to npm, you’ll switch these to versioned npm references — the admin update button handles this automatically from that point forward.

### 1.3 Create your `.env`

```bash
cp node_modules/@cms/core/.env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL=postgresql://cms:cms@localhost:5432/cms

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-very-long-random-secret-here
REFRESH_TOKEN_SECRET=another-very-long-random-secret-here

# Site
SITE_URL=https://kritano.com
ADMIN_URL=https://kritano.com/admin

# Media
MEDIA_PATH=./media

# Kritano integration (connect after first login)
KRITANO_API_TOKEN=
KRITANO_SITE_ID=

# Update channel
CMS_UPDATE_CHANNEL=development

# Optional — OAuth (add later)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=

# Optional — Typesense (add if installing search)
# TYPESENSE_HOST=localhost
# TYPESENSE_PORT=8108
# TYPESENSE_PROTOCOL=http
# TYPESENSE_API_KEY=
```

### 1.4 Create your `cms.config.ts`

This is where your content schema lives. Start with the collections you need for a portfolio:

```typescript
import {
  defineConfig,
  defineCollection,
  text, textarea, slug, richText, url,
  select, multiSelect, media, array,
  datetime, boolean, blocks, block,
  seoBlock, colour
} from '@cms/core'

export default defineConfig({
  site: {
    name: 'Kritano',
    domain: 'https://kritano.com',
    language: 'en',
  },

  collections: [

    // --- Pages ---
    defineCollection('page', {
      fields: {
        title:         text().required(),
        slug:          slug().from('title'),
        content:       blocks([
          block('hero', {
            heading:    text().required(),
            subheading: text(),
            ctaLabel:   text(),
            ctaUrl:     url(),
            image:      media(),
          }),
          block('text', {
            body: richText(),
          }),
          block('image-text', {
            heading: text(),
            body:    richText(),
            image:   media(),
            imagePosition: select(['left', 'right']).default('right'),
          }),
          block('cta', {
            heading:    text().required(),
            body:       textarea(),
            ctaLabel:   text().required(),
            ctaUrl:     url().required(),
            background: colour().default('#0d0d0d'),
          }),
        ]),
        status:        select(['draft', 'published']).default('draft'),
        seo:           seoBlock(),
      }
    }),

    // --- Blog / Articles ---
    defineCollection('article', {
      fields: {
        title:         text().required(),
        slug:          slug().from('title'),
        excerpt:       textarea().maxLength(300),
        body:          richText(),
        featuredImage: media(),
        tags:          array(text()),
        publishedAt:   datetime().nullable(),
        status:        select(['draft', 'published']).default('draft'),
        seo:           seoBlock(),
      }
    }),

    // --- Projects / Work ---
    defineCollection('project', {
      fields: {
        title:       text().required(),
        slug:        slug().from('title'),
        description: richText(),
        url:         url().nullable(),
        githubUrl:   url().nullable(),
        tags:        array(text()),
        images:      array(media()),
        featured:    boolean().default(false),
        status:      select(['draft', 'published']).default('draft'),
        seo:         seoBlock(),
      }
    }),

    // --- Products (Scalar, PagePulser etc.) ---
    defineCollection('product', {
      fields: {
        title:       text().required(),
        slug:        slug().from('title'),
        tagline:     text(),
        description: richText(),
        url:         url().nullable(),
        logo:        media().nullable(),
        status:      select(['draft', 'published', 'coming-soon']).default('draft'),
        featured:    boolean().default(false),
        seo:         seoBlock(),
      }
    }),

    // --- Case Studies ---
    defineCollection('case-study', {
      fields: {
        title:         text().required(),
        slug:          slug().from('title'),
        client:        text(),
        summary:       textarea(),
        content:       richText(),
        featuredImage: media(),
        tags:          array(text()),
        publishedAt:   datetime().nullable(),
        status:        select(['draft', 'published']).default('draft'),
        seo:           seoBlock(),
      }
    }),

  ]
})
```

### 1.5 Your theme

Create your portfolio theme in `themes/kritano/`:

```
themes/kritano/
├── theme.config.ts
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   └── blocks/
│       ├── Hero.astro
│       ├── Text.astro
│       ├── ImageText.astro
│       └── CTA.astro
├── layouts/
│   └── Base.astro
├── templates/
│   ├── page.astro
│   ├── article.astro
│   ├── article-list.astro
│   ├── project.astro
│   ├── project-list.astro
│   ├── product.astro
│   └── product-list.astro
├── pages/
│   ├── index.astro
│   └── 404.astro
└── styles/
    └── global.css
```

```typescript
// themes/kritano/theme.config.ts
import { defineTheme } from '@cms/astro'

export default defineTheme({
  name: 'kritano',
  version: '1.0.0',
  templates: {
    page:           './templates/page.astro',
    article:        './templates/article.astro',
    'article-list': './templates/article-list.astro',
    project:        './templates/project.astro',
    'project-list': './templates/project-list.astro',
    product:        './templates/product.astro',
    'product-list': './templates/product-list.astro',
  },
  settings: {
    siteName:      { type: 'text',   label: 'Site Name',      default: 'Kritano' },
    logo:          { type: 'media',  label: 'Logo' },
    primaryColour: { type: 'colour', label: 'Primary Colour', default: '#0d0d0d' },
    accentColour:  { type: 'colour', label: 'Accent Colour',  default: '#c84b2f' },
  }
})
```

Reference your theme in `cms.config.ts`:

```typescript
export default defineConfig({
  theme: './themes/kritano',
  // ... rest of config
})
```

### 1.6 `.gitignore`

```
node_modules/
dist/
.env
media/
*.local
```

### 1.7 Install and run locally

```bash
bun install
bun run dev
```

This starts:

- Postgres + Redis via Docker Compose (from the CMS packages)
- API on `http://localhost:3001`
- Admin on `http://localhost:3001/admin`
- Astro dev server on `http://localhost:4321`

First login: `admin@cms.local` / `admin` — change this immediately in the admin.

-----

## Part 2 — Connecting Kritano

On first login, go to **Admin → Site → Site Health**.

Click **Connect Kritano** — this opens the connection modal. You already have a Kritano account, so click **I already have an account** and complete the OAuth flow.

The CMS will automatically:

- Create a site record in Kritano for `kritano.com`
- Store the API token in your `.env` (`KRITANO_API_TOKEN` and `KRITANO_SITE_ID`)
- Activate the Site Health dashboard
- Enable the editor sidebar SEO analysis panel

-----

## Part 3 — Deploying to your server

Go to **Admin → Deployment → Setup**.

Fill in:

- Server IP: your VPS IP
- Domain: `kritano.com`
- Email: your email for Let’s Encrypt
- OS: Ubuntu 24.04
- Include Typesense: Yes (recommended)

Click **Generate Script**, copy the output, SSH into your server and run it:

```bash
ssh root@your-server-ip
# paste and run the generated script
```

The script installs everything and starts the CMS. Your site will be live at `https://kritano.com` when it completes.

-----

## Part 4 — Keeping the CMS up to date

The admin shows a notification when a new CMS version is available — a banner on the dashboard and a badge on the Deployment sidebar item. It tells you what changed and gives you the exact commands to run. Nothing happens automatically.

**When you see an update notification:**

```bash
# 1. In your portfolio project locally
bun update @cms/core @cms/admin @cms/astro @cms/sdk @cms/cli @cms/types

# 2. Test locally
bun run dev

# 3. Commit the updated lockfile
git add bun.lock && git commit -m "chore: update CMS to latest"

# 4. Push — GitHub Action handles the server deploy
git push
```

The admin **Copy commands** button puts these four lines on your clipboard. Paste, run, done.

The lockfile is the source of truth. `bun install` on the server installs exactly what the lockfile says — no surprises, no drift, no conflicts between your theme changes and CMS package versions.

**Switching to release mode when stable versions ship:**

Update `package.json` dependencies from GitHub references to versioned npm:

```json
"@cms/core": "^0.3.0"
```

Set in `.env`:

```env
CMS_UPDATE_CHANNEL=release
```

The notification then shows semver version numbers and flags patch / minor / major — same four-command flow, just cleaner labels.

-----

## Part 5 — Repo structure summary

```
github.com/Kritano/Kritano-cms          ← CMS source (you develop this)
github.com/Kritano/kritano-portfolio    ← Your portfolio (uses CMS as dependency)

kritano-portfolio/
├── cms.config.ts          ← Your schema (collections, site config, theme)
├── themes/
│   └── kritano/           ← Your custom theme
├── plugins/               ← Any local custom plugins (optional)
├── package.json           ← CMS packages as dependencies
├── .env                   ← Environment config (not committed)
├── .gitignore
└── bun.lock
```

**What lives in the CMS repo:** The core engine, admin UI, API, CLI, SDK, Astro integration, default theme, all packages.

**What lives in your portfolio repo:** Your schema config, your theme, your content (via the database on your server), your environment config.

**What never gets overwritten by a CMS update:** Your `cms.config.ts`, your theme, your content, your `.env`. Updates only touch the CMS packages in `node_modules` — never your project files.

-----

## Part 6 — Workflow day to day

**Adding a new content type to your portfolio:**

1. Add the collection to `cms.config.ts` locally
1. Run `bun run dev` — auto-runs migrations, updates types
1. Create content in the admin at `localhost:3001/admin`
1. Build your template in `themes/kritano/templates/`
1. Push your portfolio repo changes to GitHub
1. SSH into server, pull your portfolio repo, run `bun run migrate && bun run build`

Or, once the CMS update system is live, add a GitHub Action to auto-deploy your portfolio repo on push — it just runs `bun install && bun run migrate && bun run build && systemctl restart cms-api`.

**When a new CMS version drops:**

1. Go to the admin on your live site
1. Deployment → Updates → Apply update
1. Done

**When you want to test a CMS change locally before it’s on `main`:**

```bash
# In your portfolio project
# Temporarily point at a branch
bun add "@cms/core@github:Kritano/Kritano-cms#feature/my-branch"
bun run dev
# Test, then revert back to main
bun add "@cms/core@github:Kritano/Kritano-cms#main"
```

-----

## Part 7 — GitHub Action for portfolio auto-deploy (optional)

Once Phase 0.3 is live, add this to your portfolio repo to auto-deploy on push to `main`:

```yaml
# .github/workflows/deploy.yml
name: Deploy portfolio

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_IP }}
          username: root
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/portfolio
            git pull origin main
            bun install
            bun run migrate
            bun run build
            systemctl restart cms-api cms-worker
```

Add `SERVER_IP` and `SSH_KEY` as GitHub secrets on your portfolio repo.

This covers theme changes, new templates, and `cms.config.ts` schema changes — they deploy automatically on push. CMS core updates still go through the admin update button (or you can trigger them here too by calling the update API endpoint from the action).

-----

*Kritano Portfolio Setup Guide*
*CMS repo: github.com/Kritano/Kritano-cms*
*Last updated to reflect Phase 0.3 update system*