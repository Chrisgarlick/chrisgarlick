#!/usr/bin/env node
/**
 * sync-layout-json.mjs
 *
 * Reads each public/resources/<slug>/<slug>.json and PATCHes the matching
 * Kritano resource record's `layoutJson` field with the raw JSON contents.
 *
 * Pre-requisite: the `layout_json` column must exist on the `resources` table
 * (migrations/0002_*.sql) and `layoutJson` must be declared in cms.config.ts.
 *
 * Usage:
 *   node scripts/sync-layout-json.mjs                  # local CMS (CMS_API_URL)
 *   node scripts/sync-layout-json.mjs --live           # live chrisgarlick.com CMS
 *   node scripts/sync-layout-json.mjs --slug <one>     # only one resource
 *   node scripts/sync-layout-json.mjs --dry-run        # show what would change
 *
 * Auth:
 *   - Local:  uses API_KEY from .env (Bearer)
 *   - --live: uses JWT_TOKEN from .env (Bearer)
 */

import fs from 'node:fs'
import path from 'node:path'

if (!process.env.JWT_TOKEN && fs.existsSync('.env')) {
  for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
    const m1 = line.match(/^JWT_TOKEN=(.+)$/)
    if (m1) process.env.JWT_TOKEN = m1[1].trim()
    const m2 = line.match(/^API_KEY=(.+)$/)
    if (m2) process.env.API_KEY = m2[1].trim()
    const m3 = line.match(/^CMS_API_URL=(.+)$/)
    if (m3) process.env.CMS_API_URL = m3[1].trim()
  }
}

const args = process.argv.slice(2)
const LIVE = args.includes('--live')
const DRY_RUN = args.includes('--dry-run')
const slugIdx = args.indexOf('--slug')
const ONLY_SLUG = slugIdx >= 0 ? args[slugIdx + 1] : null

const BASE = LIVE ? 'https://chrisgarlick.com/api' : (process.env.CMS_API_URL || 'http://localhost:3000/api')
const TOKEN = LIVE ? process.env.JWT_TOKEN : (process.env.API_KEY || process.env.JWT_TOKEN)
if (!TOKEN) {
  console.error(`No auth token. ${LIVE ? 'Set JWT_TOKEN.' : 'Set API_KEY (preferred for local) or JWT_TOKEN.'}`)
  process.exit(1)
}

const auth = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }

async function findResource(slug) {
  // Kritano supports filtered list queries; we ask for the exact slug.
  const url = `${BASE}/resource?slug=${encodeURIComponent(slug)}&limit=1`
  const res = await fetch(url, { headers: auth })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`GET ${url}: ${res.status} ${txt.slice(0, 200)}`)
  }
  const data = await res.json()
  const items = data.data || data.items || []
  return items.find((r) => r.slug === slug) || null
}

async function patchResource(id, layoutJson) {
  const res = await fetch(`${BASE}/resource/${id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ layoutJson }),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`PATCH ${id}: ${res.status} ${txt.slice(0, 200)}`)
  }
  return res.json()
}

const RESOURCES_DIR = 'public/resources'
const entries = fs.readdirSync(RESOURCES_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((slug) => !ONLY_SLUG || slug === ONLY_SLUG)
  .sort()

console.log(`\nTarget: ${BASE}${LIVE ? '  (LIVE)' : '  (local)'}${DRY_RUN ? '  [dry-run]' : ''}`)
console.log(`Resources to sync: ${entries.length}\n`)

let ok = 0
let skipped = 0
let failed = 0

for (const slug of entries) {
  const jsonPath = path.join(RESOURCES_DIR, slug, `${slug}.json`)
  if (!fs.existsSync(jsonPath)) {
    console.log(`  · ${slug}  (no .json file, skipping)`)
    skipped++
    continue
  }

  const raw = fs.readFileSync(jsonPath, 'utf8').trim()

  // Validate it parses; we still ship the raw string so Typeset's content
  // field receives bytes-identical JSON.
  try { JSON.parse(raw) } catch (e) {
    console.log(`  ✗ ${slug}  invalid JSON: ${e.message}`)
    failed++
    continue
  }

  if (DRY_RUN) {
    console.log(`  → ${slug}  ${raw.length.toLocaleString()} bytes  (would PATCH)`)
    ok++
    continue
  }

  try {
    const resource = await findResource(slug)
    if (!resource) {
      console.log(`  ✗ ${slug}  not found in CMS`)
      failed++
      continue
    }
    await patchResource(resource.id, raw)
    console.log(`  ✓ ${slug}  ${raw.length.toLocaleString()} bytes  → ${resource.id}`)
    ok++
  } catch (err) {
    console.log(`  ✗ ${slug}  ${err.message}`)
    failed++
  }
}

console.log(`\nDone. ${ok} synced, ${skipped} skipped, ${failed} failed.`)
process.exit(failed > 0 ? 1 : 0)
