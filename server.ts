#!/usr/bin/env bun

import { resolve, join } from 'node:path'
import { existsSync } from 'node:fs'
import { createServer, loadPlugins, syncDeclaredForms } from '@kritano/cms/core'
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

// ---------------------------------------------------------------------------
// Form submission → Resend email
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY)

app.post('/api/forms/submit', async (c) => {
  let body: Record<string, string>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request body.' }, 400)
  }

  const { name, email, ...rest } = body
  if (!name || !email) {
    return c.json({ error: 'Name and email are required.' }, 400)
  }

  // Build a readable HTML email from all submitted fields
  const fields = Object.entries(body)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    .join('')

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Chris Garlick <chrisgarlick@kritano.com>',
      to: process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com',
      replyTo: email,
      subject: `New form submission from ${name}`,
      html: `<h2>New form submission</h2>${fields}`,
    })

    return c.json({ success: true })
  } catch (err: any) {
    console.error('[Forms] Resend error:', err)
    return c.json({ error: 'Failed to send email.' }, 500)
  }
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
  const apiKey = process.env.KRITANO_PLATFORM_API_KEY
  const apiBase = process.env.KRITANO_PLATFORM_API_URL

  if (!apiKey || !apiBase) {
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

  try {
    const res = await fetch(`${apiBase}/audit/single`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: parsedUrl.href }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.error(`[Audit] Kritano API error:`, res.status, errData)
      return c.json({ error: 'Audit service temporarily unavailable. Please try again.' }, 502)
    }

    const data: any = await res.json()

    return c.json({
      url: parsedUrl.href,
      scores: {
        overall: data.scores?.overall ?? data.overall ?? null,
        seo: data.scores?.seo ?? data.seo ?? null,
        accessibility: data.scores?.accessibility ?? data.accessibility ?? null,
        performance: data.scores?.performance ?? data.performance ?? null,
      },
    })
  } catch (err: any) {
    console.error(`[Audit] Request failed:`, err.message)
    return c.json({ error: 'Could not reach audit service. Please try again.' }, 502)
  }
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
