#!/usr/bin/env bun

import { resolve, join } from 'node:path'
import { existsSync } from 'node:fs'
import { createServer, loadPlugins, syncDeclaredForms, getClient } from '@kritano/cms/core'
import { Resend } from 'resend'

// Load config from the project root
const configPath = resolve(process.cwd(), 'cms.config')
const { default: config } = await import(configPath)

const app = createServer(config)
const port = parseInt(process.env.PORT || '3000', 10)

// Load plugins if configured
if (config.plugins && config.plugins.length > 0) {
  const result = await loadPlugins(config, app)
  if (!result.success) {
    console.error('[CMS] Server cannot start due to plugin conflicts.')
    process.exit(1)
  }
}

// Sync forms declared in cms.config.ts to the database
syncDeclaredForms().catch((err: any) => console.warn(`[CMS] Form sync: ${err}`))

// Create audit_logs table if it doesn't exist
const sql = getClient()
sql`
  CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    url text NOT NULL,
    domain text,
    ip text,
    scores jsonb,
    issues jsonb,
    kritano_audit_id text,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`.catch((err: any) => console.warn(`[Audit] Table setup: ${err}`))

// ---------------------------------------------------------------------------
// Form submission → Resend email notification
// Intercepts all form submissions, sends email via Resend, then lets CMS store it
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY)

app.post('/api/forms/:slug/submit', async (c, next) => {
  // Clone the request body before the CMS handler consumes it
  const body = await c.req.json() as Record<string, string>

  // Rebuild the request so the CMS handler can still read it
  c.req.raw = new Request(c.req.raw, {
    body: JSON.stringify(body),
  })

  const toEmail = process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com'
  const fromEmail = process.env.EMAIL_FROM || 'Chris Garlick <chrisgarlick@kritano.com>'

  const fields = Object.entries(body)
    .filter(([key]) => key !== '_hp')
    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    .join('')

  const name = body.name || 'Unknown'
  const slug = c.req.param('slug')

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: body.email || undefined,
      subject: `New ${slug} submission from ${name}`,
      html: `<h2>New ${slug} form submission</h2>${fields}`,
    })
    console.log(`[Forms] Email sent to ${toEmail} for ${slug} submission`)
  } catch (err: any) {
    console.error('[Forms] Resend error:', err)
  }

  // Continue to CMS handler to store submission
  await next()
})

// ---------------------------------------------------------------------------
// Custom tool routes
// ---------------------------------------------------------------------------

// In-memory rate limiter: 10 requests per hour per IP
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimits.get(ip)

  if (!entry || entry.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }

  if (entry.count >= 10) return false

  entry.count++
  return true
}

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(ip)
  }
}, 10 * 60 * 1000)

app.post('/api/tools/audit', async (c) => {
  const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    || c.req.header('x-real-ip')
    || 'unknown'

  if (!checkRateLimit(ip)) {
    return c.json({ error: 'Rate limit exceeded. Please try again later.' }, 429)
  }

  let body: any
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request body.' }, 400)
  }

  const { url } = body
  if (!url || typeof url !== 'string') {
    return c.json({ error: 'URL is required.' }, 400)
  }

  // Validate URL
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol')
    }
  } catch {
    return c.json({ error: 'Please provide a valid HTTP or HTTPS URL.' }, 400)
  }

  // Proxy to Kritano platform API
  const apiKey = process.env.KRITANO_API
  const apiBase = process.env.KRITANO_PLATFORM_API_URL || 'https://kritano.com/api/v1'

  if (!apiKey) {
    // Mock response for development / before API is configured
    console.log(`[Audit] Mock audit for: ${parsedUrl.href}`)
    return c.json({
      url: parsedUrl.href,
      scores: {
        overall: Math.floor(Math.random() * 40) + 50,
        seo: Math.floor(Math.random() * 40) + 50,
        accessibility: Math.floor(Math.random() * 40) + 50,
        performance: Math.floor(Math.random() * 40) + 50,
      },
      mock: true,
    })
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  try {
    // 1. Create the audit (single page only for the free tool)
    const createRes = await fetch(`${apiBase}/audits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url: parsedUrl.href,
        options: { maxPages: 1, maxDepth: 1 },
      }),
    })

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}))
      console.error(`[Audit] Create failed:`, createRes.status, errData)
      return c.json({ error: 'Audit service temporarily unavailable. Please try again.' }, 502)
    }

    const audit: any = await createRes.json()
    const auditId = audit.id

    // 2. Poll until completed (max 60 seconds, every 2 seconds)
    const maxAttempts = 30
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const pollRes = await fetch(`${apiBase}/audits/${auditId}`, { headers })
      if (!pollRes.ok) {
        console.error(`[Audit] Poll failed:`, pollRes.status)
        continue
      }

      const result: any = await pollRes.json()

      if (result.status === 'completed') {
        const scores = result.scores || {}
        const scoreValues = [scores.seo, scores.accessibility, scores.performance, scores.security].filter((s: any) => s != null)
        const overall = scoreValues.length > 0
          ? Math.round(scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length)
          : null

        const responseScores = {
          overall,
          seo: scores.seo ?? null,
          accessibility: scores.accessibility ?? null,
          performance: scores.performance ?? null,
        }

        // Log to database
        sql`
          INSERT INTO audit_logs (url, domain, ip, scores, issues, kritano_audit_id)
          VALUES (${parsedUrl.href}, ${parsedUrl.hostname}, ${ip}, ${JSON.stringify(responseScores)}, ${JSON.stringify(result.issues || null)}, ${auditId})
        `.catch((err: any) => console.error(`[Audit] Log failed:`, err))

        return c.json({
          url: parsedUrl.href,
          scores: responseScores,
          issues: result.issues || null,
        })
      }

      if (result.status === 'failed') {
        console.error(`[Audit] Audit failed for ${parsedUrl.href}`)
        return c.json({ error: 'Audit failed. The site may be unreachable.' }, 502)
      }
    }

    // Timed out
    return c.json({ error: 'Audit is taking longer than expected. Please try again in a few minutes.' }, 504)
  } catch (err: any) {
    console.error(`[Audit] Request failed:`, err.message)
    return c.json({ error: 'Could not reach audit service. Please try again.' }, 502)
  }
})

// Recent audits — public (no IPs or sensitive data)
app.get('/api/tools/audit/recent', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') || '20', 10), 50)

  const logs = await sql`
    SELECT domain, scores, created_at
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  return c.json({ data: logs })
})

// Audit logs — full data, requires auth
app.get('/api/tools/audit/logs', async (c) => {
  const auth = c.req.header('authorization')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)

  const limit = parseInt(c.req.query('limit') || '50', 10)
  const offset = parseInt(c.req.query('offset') || '0', 10)

  const logs = await sql`
    SELECT id, url, domain, ip, scores, issues, kritano_audit_id, created_at
    FROM audit_logs
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  const total = await sql`SELECT count(*)::int as count FROM audit_logs`

  return c.json({
    data: logs,
    total: total[0].count,
    limit,
    offset,
  })
})

// ---------------------------------------------------------------------------
// Serve admin static files in production
// ---------------------------------------------------------------------------
const cmsDir = resolve(import.meta.dir, 'node_modules/@kritano/cms')
const adminDistPath = join(cmsDir, 'packages/admin/dist')
const adminBuilt = existsSync(adminDistPath)

if (adminBuilt) {
  app.get('/admin', (c) => c.redirect('/admin/'))

  const mimeTypes: Record<string, string> = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }

  app.get('/admin/*', async (c) => {
    const reqPath = c.req.path.replace(/^\/admin/, '')
    const filePath = join(adminDistPath, reqPath)
    const file = Bun.file(filePath)

    if (await file.exists()) {
      const ext = filePath.substring(filePath.lastIndexOf('.'))
      const contentType = mimeTypes[ext]
      return new Response(file, contentType ? {
        headers: { 'Content-Type': contentType },
      } : undefined)
    }

    return new Response(Bun.file(join(adminDistPath, 'index.html')), {
      headers: { 'Content-Type': 'text/html' },
    })
  })
}

console.log(`CMS API server running on http://localhost:${port}`)
console.log(`  Health: http://localhost:${port}/api/health`)
console.log(`  GraphQL: http://localhost:${port}/api/graphql`)
console.log(`  Audit tool: POST http://localhost:${port}/api/tools/audit`)
if (adminBuilt) {
  console.log(`  Admin: http://localhost:${port}/admin`)
}

Bun.serve({
  fetch: app.fetch,
  port,
})
