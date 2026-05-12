#!/usr/bin/env bun

import { resolve, join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { createHmac, timingSafeEqual, randomUUID, createHash } from 'node:crypto'
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

// Resource-gating tables
sql`
  CREATE TABLE IF NOT EXISTS resource_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    first_name text,
    company text,
    sector text,
    source_slug text,
    marketing_consent boolean NOT NULL DEFAULT false,
    ip text,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`.catch((err: any) => console.warn(`[Resources] resource_leads setup: ${err}`))

sql`
  CREATE TABLE IF NOT EXISTS resource_downloads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id uuid NOT NULL REFERENCES resource_leads(id) ON DELETE CASCADE,
    resource_slug text NOT NULL,
    format text NOT NULL,
    ip text,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`.catch((err: any) => console.warn(`[Resources] resource_downloads setup: ${err}`))

sql`CREATE INDEX IF NOT EXISTS resource_downloads_slug_idx ON resource_downloads (resource_slug)`
  .catch((err: any) => console.warn(`[Resources] index setup: ${err}`))

// ---------------------------------------------------------------------------
// Form submission → stores in DB + sends email via Resend
// Standalone route so it works regardless of CMS version
// ---------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY)

app.post('/api/forms/send', async (c) => {
  let body: Record<string, string>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request body.' }, 400)
  }

  // Honeypot check
  if (body._hp) return c.json({ success: true })
  delete body._hp

  const { name, email } = body
  if (!name || !email) {
    return c.json({ error: 'Name and email are required.' }, 400)
  }

  // Store submission in form_submissions table
  try {
    const formRows = await sql`SELECT id, name, slug FROM forms WHERE slug = 'contact' LIMIT 1`
    if (formRows.length > 0) {
      const form = formRows[0] as Record<string, unknown>
      const ip = c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() || c.req.header('X-Real-IP') || null
      const userAgent = c.req.header('User-Agent') || null
      await sql`
        INSERT INTO form_submissions (form_id, data, ip_address, user_agent)
        VALUES (${form.id as string}, ${JSON.stringify(body)}::jsonb, ${ip}, ${userAgent})
      `
    }
  } catch (err: any) {
    console.error('[Forms] DB error:', err)
  }

  // Send email via Resend
  const toEmail = process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com'
  const fromEmail = process.env.EMAIL_FROM || 'Chris Garlick <chrisgarlick@kritano.com>'

  const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const tableRows = Object.entries(body)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, value]) => {
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
      return `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;color:#374151">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827">${escapeHtml(value || '')}</td></tr>`
    })
    .join('')

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#111827;font-size:18px;margin-bottom:16px">New contact form submission</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${tableRows}</table>
      <p style="color:#9ca3af;font-size:12px">Submitted at ${new Date().toISOString()}</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html,
    })
    console.log(`[Forms] Email sent to ${toEmail}`)
  } catch (err: any) {
    console.error('[Forms] Resend error:', err)
    return c.json({ error: 'Failed to send email.' }, 500)
  }

  return c.json({ success: true })
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
// Resource gating: email capture, magic-link token, download delivery
// ---------------------------------------------------------------------------

const TOKEN_SECRET = process.env.RESOURCE_TOKEN_SECRET || process.env.JWT_SECRET || 'dev-secret-change-me'
const COOKIE_NAME = 'cg_lead'
const COOKIE_FLAG = 'cg_lead_flag'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90      // 90 days
const EMAIL_TOKEN_TTL = 60 * 60 * 24 * 7      // magic-link valid 7 days
const COOKIE_TOKEN_TTL = 60 * 60 * 24 * 90    // cookie valid 90 days
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://chrisgarlick.com'

function b64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf) : buf
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4))
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64')
}

function signToken(leadId: string, ttlSeconds: number): string {
  const payload = { l: leadId, e: Math.floor(Date.now() / 1000) + ttlSeconds }
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', TOKEN_SECRET).update(body).digest()
  return `${body}.${b64url(sig)}`
}

function verifyToken(token: string | undefined | null): { leadId: string } | null {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', TOKEN_SECRET).update(body).digest()
  const provided = b64urlDecode(sig)
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null
  try {
    const payload = JSON.parse(b64urlDecode(body).toString('utf8'))
    if (typeof payload.l !== 'string' || typeof payload.e !== 'number') return null
    if (payload.e < Math.floor(Date.now() / 1000)) return null
    return { leadId: payload.l }
  } catch { return null }
}

function parseCookie(header: string | undefined, name: string): string | null {
  if (!header) return null
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return null
}

function makeCookie(name: string, value: string, opts: { httpOnly?: boolean; maxAge: number }): string {
  const parts = [
    `${name}=${value}`,
    `Max-Age=${opts.maxAge}`,
    'Path=/',
    'SameSite=Lax',
  ]
  if (opts.httpOnly) parts.push('HttpOnly')
  if (SITE_ORIGIN.startsWith('https://')) parts.push('Secure')
  return parts.join('; ')
}

function clientIp(c: any): string {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    || c.req.header('x-real-ip')
    || 'unknown'
}

const resourceRateLimits = new Map<string, { count: number; resetAt: number }>()
function checkResourceRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = resourceRateLimits.get(ip)
  if (!entry || entry.resetAt <= now) {
    resourceRateLimits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of resourceRateLimits) {
    if (entry.resetAt <= now) resourceRateLimits.delete(ip)
  }
}, 10 * 60 * 1000)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---------------------------------------------------------------------------
// Typeset client: markdown → PDF / DOCX, with content-hash disk cache
// ---------------------------------------------------------------------------

const TYPESET_API_URL = process.env.TYPESET_API_URL || 'https://typeset.chrisgarlick.com'
const TYPESET_API_KEY = process.env.TYPESET_API_KEY
const TYPESET_CACHE_DIR = resolve(import.meta.dir, '.cache/typeset')
try { mkdirSync(TYPESET_CACHE_DIR, { recursive: true }) } catch { /* ignore */ }

const TYPESET_MIME: Record<string, string> = {
  pdf:  'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

async function renderViaTypeset(opts: {
  slug: string
  markdown: string
  format: 'pdf' | 'docx'
  client?: string | null
}): Promise<{ ok: true; bytes: ArrayBuffer } | { ok: false; status: number; error: string }> {
  if (!TYPESET_API_KEY) {
    return { ok: false, status: 503, error: 'PDF/DOCX rendering is not configured.' }
  }

  const clientKey = opts.client || ''
  const hash = createHash('sha256').update(`${opts.slug}|${opts.format}|${clientKey}|${opts.markdown}`).digest('hex').slice(0, 16)
  const cachePath = join(TYPESET_CACHE_DIR, `${opts.slug}-${opts.format}-${hash}.${opts.format}`)
  const cached = Bun.file(cachePath)
  if (await cached.exists()) {
    return { ok: true, bytes: await cached.arrayBuffer() }
  }

  // Document metadata (title/subtitle/author/date) lives in the markdown's YAML frontmatter.
  // Styling theme is selected per-resource via the `typesetClient` CMS field, passed as the
  // top-level `client` field on the API request (per typeset docs).
  const body: Record<string, unknown> = {
    document_type: 'general',
    format: opts.format,
    content: opts.markdown,
  }
  if (opts.client) body.client = opts.client

  let res: Response
  try {
    res = await fetch(`${TYPESET_API_URL}/api/render`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TYPESET_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (err: any) {
    console.error('[Typeset] Request failed:', err.message)
    return { ok: false, status: 502, error: 'Could not reach the rendering service.' }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`[Typeset] ${res.status}: ${text.slice(0, 300)}`)
    return { ok: false, status: 502, error: 'Rendering failed. Please try again shortly.' }
  }

  const bytes = await res.arrayBuffer()
  Bun.write(cachePath, bytes).catch((err: any) => console.warn(`[Typeset] Cache write failed: ${err}`))
  return { ok: true, bytes }
}

app.post('/api/resources/request', async (c) => {
  let body: Record<string, any>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request body.' }, 400)
  }

  if (body._hp) return c.json({ ok: true })

  const ip = clientIp(c)
  if (!checkResourceRateLimit(ip)) {
    return c.json({ error: 'Too many requests. Please try again later.' }, 429)
  }

  const slug = String(body.slug || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const firstName = body.firstName ? String(body.firstName).trim().slice(0, 100) : null
  const company = body.company ? String(body.company).trim().slice(0, 200) : null
  const sector = body.sector ? String(body.sector).trim().slice(0, 50) : null
  const marketingConsent = body.marketingConsent === true

  if (!slug || !/^[a-z0-9-]+$/.test(slug) || !EMAIL_RE.test(email)) {
    return c.json({ error: 'A valid email and resource are required.' }, 400)
  }

  const userAgent = c.req.header('User-Agent') || null

  let leadId: string
  try {
    // Upsert by email; never downgrade marketing consent
    const rows = await sql`
      INSERT INTO resource_leads (email, first_name, company, sector, source_slug, marketing_consent, ip, user_agent)
      VALUES (${email}, ${firstName}, ${company}, ${sector}, ${slug}, ${marketingConsent}, ${ip}, ${userAgent})
      ON CONFLICT (email) DO UPDATE SET
        first_name        = COALESCE(resource_leads.first_name, EXCLUDED.first_name),
        company           = COALESCE(resource_leads.company, EXCLUDED.company),
        sector            = COALESCE(resource_leads.sector, EXCLUDED.sector),
        marketing_consent = resource_leads.marketing_consent OR EXCLUDED.marketing_consent
      RETURNING id
    `
    leadId = (rows[0] as any).id
  } catch (err: any) {
    console.error('[Resources] Lead upsert failed:', err)
    return c.json({ error: 'Could not save your details. Please try again.' }, 500)
  }

  // Mirror into form_submissions so the entry appears in /admin/forms/resource-gate
  try {
    const formRows = await sql`SELECT id FROM forms WHERE slug = 'resource-gate' LIMIT 1`
    if (formRows.length > 0) {
      const formId = (formRows[0] as any).id
      const submissionData = { email, firstName, company, sector, marketingConsent, resourceSlug: slug }
      await sql`
        INSERT INTO form_submissions (form_id, data, ip_address, user_agent)
        VALUES (${formId}, ${JSON.stringify(submissionData)}::jsonb, ${ip}, ${userAgent})
      `
    }
  } catch (err: any) {
    console.error('[Resources] form_submissions mirror failed:', err)
    // Non-fatal — we still have the lead in resource_leads
  }

  const emailToken = signToken(leadId, EMAIL_TOKEN_TTL)
  const cookieToken = signToken(leadId, COOKIE_TOKEN_TTL)
  const thanksUrl = `${SITE_ORIGIN}/resources/${encodeURIComponent(slug)}/thanks?t=${emailToken}`

  // Look up the resource title for the email subject. Fail open if it errors.
  let resourceTitle = slug
  try {
    const rows = await sql`SELECT title FROM resources WHERE slug = ${slug} LIMIT 1`
    if (rows.length > 0) resourceTitle = (rows[0] as any).title
  } catch { /* ignore */ }

  // Send delivery email to the lead
  const fromEmail = process.env.EMAIL_FROM || 'Chris Garlick <chrisgarlick@kritano.com>'
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Your download: ${resourceTitle}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#111827">
          <p style="font-size:15px;line-height:1.6">Thanks${firstName ? `, ${firstName.replace(/[<>&]/g, '')}` : ''} — here's your download.</p>
          <p style="margin:24px 0">
            <a href="${thanksUrl}" style="display:inline-block;background:#1a1715;color:#ffffff;padding:12px 20px;border-radius:3px;text-decoration:none;font-size:14px;font-weight:500">Open ${resourceTitle.replace(/[<>&]/g, '')}</a>
          </p>
          <p style="font-size:13px;color:#6b7280;line-height:1.6">This link works for 7 days. Pick your format on the download page — Markdown, PDF, HTML or DOCX where available.</p>
          <p style="font-size:13px;color:#6b7280;line-height:1.6;margin-top:24px">Chris Garlick · <a href="${SITE_ORIGIN}" style="color:#6b7280">chrisgarlick.com</a></p>
        </div>
      `,
    })
  } catch (err: any) {
    console.error('[Resources] Delivery email failed:', err)
    // Continue — the user still gets the redirect with the working token
  }

  // Internal notification
  const internalTo = process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com'
  try {
    await resend.emails.send({
      from: fromEmail,
      to: internalTo,
      subject: `Resource lead: ${email} → ${resourceTitle}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#111827">
          <p><strong>New resource lead</strong></p>
          <ul style="font-size:14px;line-height:1.7">
            <li>Email: ${email}</li>
            <li>Name: ${firstName || '—'}</li>
            <li>Company: ${company || '—'}</li>
            <li>Sector: ${sector || '—'}</li>
            <li>Resource: ${resourceTitle} (${slug})</li>
            <li>Marketing consent: ${marketingConsent ? 'yes' : 'no'}</li>
            <li>IP: ${ip}</li>
          </ul>
        </div>
      `,
    })
  } catch (err: any) {
    console.error('[Resources] Internal notify failed:', err)
  }

  // Set cookies so subsequent visits skip the gate on this device
  c.header('Set-Cookie', makeCookie(COOKIE_NAME, cookieToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE }), { append: true })
  c.header('Set-Cookie', makeCookie(COOKIE_FLAG, '1', { httpOnly: false, maxAge: COOKIE_MAX_AGE }), { append: true })

  return c.json({ ok: true, redirect: `/resources/${slug}/thanks?t=${emailToken}` })
})

app.get('/api/resources/:slug/download', async (c) => {
  const slug = c.req.param('slug')
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return c.json({ error: 'Invalid resource slug.' }, 400)
  }
  const format = (c.req.query('format') || 'md').toLowerCase()
  const queryToken = c.req.query('t')
  const cookieToken = parseCookie(c.req.header('cookie'), COOKIE_NAME)

  const verified = verifyToken(queryToken) || verifyToken(cookieToken)
  if (!verified) {
    return c.json({ error: 'This download link has expired or is invalid. Request a new one.' }, 401)
  }

  if (!['md', 'pdf', 'html', 'docx'].includes(format)) {
    return c.json({ error: 'Unknown format.' }, 400)
  }

  // HTML rendering arrives once Typeset adds it
  if (format === 'html') {
    return c.json({ error: 'HTML rendering is coming soon.' }, 503)
  }

  // Hand-authored DOCX (if present) wins over typeset-rendered DOCX
  if (format === 'docx') {
    const filePath = resolve(import.meta.dir, `public/resources/${slug}/${slug}.docx`)
    const file = Bun.file(filePath)
    if (await file.exists()) {
      logDownload(verified.leadId, slug, 'docx', c)
      refreshLeadCookies(c, verified.leadId)
      return new Response(file, {
        headers: {
          'Content-Type': TYPESET_MIME.docx,
          'Content-Disposition': `attachment; filename="${slug}.docx"`,
          'Cache-Control': 'private, no-store',
        },
      })
    }
    // Otherwise fall through to typeset render
  }

  // Look up the markdown body + typeset client profile for this resource
  let markdown: string | null = null
  let typesetClient: string | null = null
  try {
    const rows = await sql`SELECT markdown_body, typeset_client FROM resources WHERE slug = ${slug} LIMIT 1`
    if (rows.length > 0) {
      const row = rows[0] as any
      markdown = row.markdown_body || null
      typesetClient = row.typeset_client || null
    }
  } catch (err: any) {
    console.error('[Resources] Resource lookup failed:', err)
  }
  if (!markdown) {
    return c.json({ error: 'Resource content not found.' }, 404)
  }

  logDownload(verified.leadId, slug, format, c)
  refreshLeadCookies(c, verified.leadId)

  if (format === 'md') {
    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}.md"`,
        'Cache-Control': 'private, no-store',
      },
    })
  }

  // pdf | docx via typeset
  const rendered = await renderViaTypeset({ slug, markdown, format: format as 'pdf' | 'docx', client: typesetClient })
  if (!rendered.ok) {
    return c.json({ error: rendered.error }, rendered.status as any)
  }
  return new Response(rendered.bytes, {
    headers: {
      'Content-Type': TYPESET_MIME[format],
      'Content-Disposition': `attachment; filename="${slug}.${format}"`,
      'Cache-Control': 'private, no-store',
    },
  })
})

function logDownload(leadId: string, slug: string, format: string, c: any) {
  sql`
    INSERT INTO resource_downloads (lead_id, resource_slug, format, ip)
    VALUES (${leadId}, ${slug}, ${format}, ${clientIp(c)})
  `.catch((err: any) => console.error('[Resources] Download log failed:', err))
}

function refreshLeadCookies(c: any, leadId: string) {
  const refreshed = signToken(leadId, COOKIE_TOKEN_TTL)
  c.header('Set-Cookie', makeCookie(COOKIE_NAME, refreshed, { httpOnly: true, maxAge: COOKIE_MAX_AGE }), { append: true })
  c.header('Set-Cookie', makeCookie(COOKIE_FLAG, '1', { httpOnly: false, maxAge: COOKIE_MAX_AGE }), { append: true })
}

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
console.log(`  Resources: POST http://localhost:${port}/api/resources/request`)
if (adminBuilt) {
  console.log(`  Admin: http://localhost:${port}/admin`)
}

Bun.serve({
  fetch: app.fetch,
  port,
})
