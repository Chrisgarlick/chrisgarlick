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

// Segmentation field added in Phase 1 of the pivot — captures "what manual task do you wish
// you never had to do again?" so post-audit follow-ups can be tailored.
sql`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS task text`
  .catch((err: any) => console.warn(`[Audit] task column setup: ${err}`))

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

// AI Readiness Audit tables (see conditional.md). audit_submissions holds the workflow state
// for each /audit form submission; outbound_email_log records each delivery email sent.
// Kritano's upcoming GDPR feature will register audit_submissions as a custom source via
// registerGdprSource() once available — until then, gdpr_runbook.md documents the manual SQL.
sql`
  CREATE TABLE IF NOT EXISTS audit_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_ref text NOT NULL UNIQUE,
    email text NOT NULL,
    data jsonb NOT NULL,
    status text NOT NULL DEFAULT 'submitted',
    pdf_path text,
    ip_address text,
    user_agent text,
    privacy_notice_version text NOT NULL,
    submitted_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz,
    deleted_at timestamptz,
    deletion_reason text
  )
`.catch((err: any) => console.warn(`[Audit] audit_submissions setup: ${err}`))

sql`CREATE INDEX IF NOT EXISTS audit_submissions_email_idx ON audit_submissions (email)`
  .catch((err: any) => console.warn(`[Audit] email index setup: ${err}`))

sql`CREATE INDEX IF NOT EXISTS audit_submissions_status_idx ON audit_submissions (status)`
  .catch((err: any) => console.warn(`[Audit] status index setup: ${err}`))

sql`CREATE INDEX IF NOT EXISTS audit_submissions_submitted_at_idx ON audit_submissions (submitted_at)`
  .catch((err: any) => console.warn(`[Audit] submitted_at index setup: ${err}`))

sql`
  CREATE TABLE IF NOT EXISTS outbound_email_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_submission_id uuid REFERENCES audit_submissions(id) ON DELETE SET NULL,
    to_email text NOT NULL,
    subject text NOT NULL,
    template text NOT NULL,
    sent_at timestamptz NOT NULL DEFAULT now(),
    resend_message_id text
  )
`.catch((err: any) => console.warn(`[Audit] outbound_email_log setup: ${err}`))

sql`CREATE INDEX IF NOT EXISTS outbound_email_log_to_email_idx ON outbound_email_log (to_email)`
  .catch((err: any) => console.warn(`[Audit] outbound email index setup: ${err}`))

// Phase B1 — admin notes column. Used by /studio/audits for Chris's review notes
// before generation (e.g. "spoke on LinkedIn", "budget likely £2-5k", "fit for workflow").
sql`ALTER TABLE audit_submissions ADD COLUMN IF NOT EXISTS admin_notes text`
  .catch((err: any) => console.warn(`[Audit] admin_notes column setup: ${err}`))

// audit_markdown: the markdown body of the deliverable audit, pasted in from Claude
// locally. Persisted so the PDF can be re-rendered if the template changes.
sql`ALTER TABLE audit_submissions ADD COLUMN IF NOT EXISTS audit_markdown text`
  .catch((err: any) => console.warn(`[Audit] audit_markdown column setup: ${err}`))

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
// /audit — AI Readiness Audit intake (conditional.md). Validates, generates a
// CG-YYYY-NNN audit_ref, writes to audit_submissions + form_submissions, sends
// an acknowledgement to the prospect and a notification to chris@chrisgarlick.com.
// ---------------------------------------------------------------------------

import auditFormSchemaJson from './config/audit-form.json' with { type: 'json' }
const auditFormSchema = auditFormSchemaJson as any

// Universal required fields — every submission must have these regardless of sector.
const AUDIT_REQUIRED = ['name', 'email', 'companyName', 'website', 'sector', 'teamSize', 'biggestBottleneck']
const AUDIT_VALID_SECTORS = new Set(auditFormSchema.sectors.map((s: any) => s.value))
const URL_RE = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

const auditRateLimits = new Map<string, { count: number; resetAt: number }>()
function checkAuditRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = auditRateLimits.get(ip)
  if (!entry || entry.resetAt <= now) {
    auditRateLimits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of auditRateLimits) {
    if (entry.resetAt <= now) auditRateLimits.delete(ip)
  }
}, 10 * 60 * 1000)

// Generate CG-YYYY-NNN audit_ref. NNN is per-year sequence based on existing rows.
// Race-safe via the unique constraint on audit_ref — if two submissions land in the
// same millisecond and both pick the same number, the second INSERT fails and we retry.
async function nextAuditRef(): Promise<string> {
  const year = new Date().getFullYear()
  const rows = await sql`
    SELECT COALESCE(MAX(CAST(SPLIT_PART(audit_ref, '-', 3) AS INTEGER)), 0) AS max_n
    FROM audit_submissions
    WHERE audit_ref LIKE ${'CG-' + year + '-%'}
  `
  const nextN = ((rows[0] as any).max_n || 0) + 1
  return `CG-${year}-${String(nextN).padStart(3, '0')}`
}

app.post('/api/audit/submit', async (c) => {
  let body: Record<string, any>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request body.' }, 400)
  }

  // Honeypot
  if (body._hp) return c.json({ ok: true })
  delete (body as any)._hp

  // Rate limit
  const ip = clientIp(c)
  if (!checkAuditRateLimit(ip)) {
    return c.json({ error: 'Too many requests. Please try again later.' }, 429)
  }

  // Required-field check
  for (const field of AUDIT_REQUIRED) {
    const v = body[field]
    if (typeof v !== 'string' || v.trim().length === 0) {
      return c.json({ error: `Missing required field: ${field}` }, 400)
    }
  }

  // Format checks
  const email = String(body.email).trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Please enter a valid email address.' }, 400)

  const website = String(body.website).trim()
  if (!URL_RE.test(website)) return c.json({ error: 'Please enter a valid website URL.' }, 400)

  if (!AUDIT_VALID_SECTORS.has(body.sector)) {
    return c.json({ error: 'Invalid sector selection.' }, 400)
  }

  const biggestBottleneck = String(body.biggestBottleneck).trim()
  if (biggestBottleneck.length < 50) {
    return c.json({ error: 'Please give a bit more detail on your biggest bottleneck (50+ characters).' }, 400)
  }

  const userAgent = c.req.header('User-Agent') || null
  const privacyNoticeVersion = auditFormSchema.privacy_notice_version

  // Allocate an audit_ref. Retry once on collision (unique constraint race).
  let auditRef = await nextAuditRef()
  let submissionId: string | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const rows = await sql`
        INSERT INTO audit_submissions (
          audit_ref, email, data, status, ip_address, user_agent, privacy_notice_version
        ) VALUES (
          ${auditRef}, ${email}, ${body}, 'submitted',
          ${ip}, ${userAgent}, ${privacyNoticeVersion}
        )
        RETURNING id
      `
      submissionId = (rows[0] as any).id
      break
    } catch (err: any) {
      // Postgres unique-violation = 23505. Retry once with the next number.
      if (err?.code === '23505' && attempt === 0) {
        auditRef = await nextAuditRef()
        continue
      }
      console.error('[Audit] audit_submissions insert failed:', err)
      return c.json({ error: 'Could not save your submission. Please try again.' }, 500)
    }
  }

  // Mirror into form_submissions so the entry shows up in /admin/forms/audit-intake
  try {
    const formRows = await sql`SELECT id FROM forms WHERE slug = 'audit-intake' LIMIT 1`
    if (formRows.length > 0) {
      const formId = (formRows[0] as any).id
      const summary = {
        name: body.name,
        email,
        companyName: body.companyName,
        website,
        sector: body.sector,
        teamSize: body.teamSize,
        biggestBottleneck,
        budgetRange: body.budgetRange || null,
        auditRef,
      }
      await sql`
        INSERT INTO form_submissions (form_id, data, ip_address, user_agent)
        VALUES (${formId}, ${JSON.stringify(summary)}::jsonb, ${ip}, ${userAgent})
      `
    }
  } catch (err: any) {
    console.error('[Audit] form_submissions mirror failed:', err)
    // Non-fatal — audit_submissions has the canonical record
  }

  const fromEmail = process.env.EMAIL_FROM || 'Chris Garlick <chrisgarlick@kritano.com>'
  const esc = (s: any) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))

  // ── Transactional acknowledgement to the prospect ───────────────
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      replyTo: process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com',
      subject: `Your AI readiness audit is being prepared — ${auditRef}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#111827">
          <p style="font-size:15px;line-height:1.6">Hi ${esc(body.name).split(' ')[0]},</p>
          <p style="font-size:15px;line-height:1.6">Thanks for your audit request. I'm reviewing your details and will have a personalised AI readiness report back to you within 24 hours.</p>
          <p style="font-size:15px;line-height:1.6">It will cover the manual workflows I've identified in your business, what each one would look like automated, indicative build costs, and a recommended first engagement.</p>
          <p style="font-size:15px;line-height:1.6">If you'd like to add anything before I start, reply to this email.</p>
          <p style="font-size:15px;line-height:1.6">Chris</p>
          <p style="font-size:12px;color:#6b7280;margin-top:24px">Reference: ${auditRef} · <a href="https://chrisgarlick.com" style="color:#6b7280">chrisgarlick.com</a></p>
        </div>
      `,
    })
  } catch (err: any) {
    console.error('[Audit] Acknowledgement email failed:', err)
    // Non-fatal — submission is stored, Chris can follow up manually
  }

  // ── Notification to Chris's personal inbox ──────────────────────
  try {
    const internalTo = process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com'
    const sectorFieldsBlock = Object.entries(body)
      .filter(([k]) => !['_hp', 'name', 'email', 'companyName', 'website', 'sector', 'teamSize', 'biggestBottleneck', 'budgetRange', 'sixMonthWin', 'notes', 'referrer'].includes(k))
      .map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(Array.isArray(v) ? v.join(', ') : v)}</li>`)
      .join('')

    await resend.emails.send({
      from: fromEmail,
      to: internalTo,
      replyTo: email,
      subject: `New audit request: ${esc(body.companyName)} (${esc(body.sector)}) — ${auditRef}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;color:#111827">
          <p style="font-size:14px;color:#6b7280;margin:0 0 8px 0">${auditRef}</p>
          <h2 style="font-size:20px;margin:0 0 16px 0">${esc(body.companyName)}</h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px">
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280;width:140px">Name</td><td style="padding:6px 0"><strong>${esc(body.name)}</strong></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Website</td><td style="padding:6px 0"><a href="${esc(website)}">${esc(website)}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Sector</td><td style="padding:6px 0"><strong>${esc(body.sector)}</strong></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Team size</td><td style="padding:6px 0">${esc(body.teamSize)}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Budget</td><td style="padding:6px 0">${esc(body.budgetRange || '—')}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280">Referrer</td><td style="padding:6px 0">${esc(body.referrer || '—')}</td></tr>
          </table>

          <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:20px 0 8px 0">Biggest bottleneck</h3>
          <p style="font-size:14px;line-height:1.6;padding:12px;background:#f9fafb;border-left:3px solid #B5522F;margin:0">${esc(body.biggestBottleneck)}</p>

          ${body.sixMonthWin ? `
            <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:20px 0 8px 0">Six-month win</h3>
            <p style="font-size:14px;line-height:1.6;margin:0">${esc(body.sixMonthWin)}</p>
          ` : ''}

          ${body.notes ? `
            <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:20px 0 8px 0">Anything else they said</h3>
            <p style="font-size:14px;line-height:1.6;margin:0">${esc(body.notes)}</p>
          ` : ''}

          <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin:20px 0 8px 0">Sector-specific answers</h3>
          <ul style="font-size:13px;line-height:1.7;padding-left:20px;margin:0">${sectorFieldsBlock || '<li>None</li>'}</ul>

          <p style="font-size:12px;color:#9ca3af;margin-top:24px">IP: ${esc(ip)} · UA: ${esc(userAgent)}</p>
        </div>
      `,
    })

    // Log this outbound email so we have a record (audit-delivery later writes here too)
    if (submissionId) {
      sql`
        INSERT INTO outbound_email_log (audit_submission_id, to_email, subject, template)
        VALUES (${submissionId}, ${internalTo}, ${`New audit request: ${body.companyName} (${body.sector}) — ${auditRef}`}, 'audit_internal_notify')
      `.catch((err: any) => console.error('[Audit] outbound_email_log notify-write failed:', err))
    }
  } catch (err: any) {
    console.error('[Audit] Internal notify failed:', err)
  }

  return c.json({ ok: true, auditRef })
})

// ---------------------------------------------------------------------------
// Self-serve audit data deletion. The audit-delivery email (Phase C) will include
// a tokenised link `/data/delete?t=<token>`. Token is HMAC-signed, no expiry, so
// the link in the email keeps working indefinitely — a prospect should always be
// able to ask for their data to be removed.
//
// Two-step flow to avoid email-prefetcher / link-scanner accidental triggers:
//   GET /api/audit/preview-delete?t=<token>  → returns submission metadata (no delete)
//   POST /api/audit/confirm-delete            → actually performs the deletion
// ---------------------------------------------------------------------------

function signAuditDeleteToken(submissionId: string): string {
  // Token shape: { k: 'ad' (kind discriminator), s: submissionId }. No expiry.
  const payload = { k: 'ad', s: submissionId }
  const body = b64url(JSON.stringify(payload))
  const sig = createHmac('sha256', TOKEN_SECRET).update(body).digest()
  return `${body}.${b64url(sig)}`
}

function verifyAuditDeleteToken(token: string | undefined | null): { submissionId: string } | null {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', TOKEN_SECRET).update(body).digest()
  const provided = b64urlDecode(sig)
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null
  try {
    const payload = JSON.parse(b64urlDecode(body).toString('utf8'))
    if (payload.k !== 'ad' || typeof payload.s !== 'string') return null
    return { submissionId: payload.s }
  } catch { return null }
}

// Tiny utility endpoint so test tokens can be minted from the dev box. Only enabled
// when ADMIN_SECRET env var is set and presented as a bearer token. Hand-mint a delete
// link with: curl -H "Authorization: Bearer $ADMIN_SECRET" \
//                 "https://chrisgarlick.com/api/audit/mint-delete-token?id=<submission-id>"
app.get('/api/audit/mint-delete-token', async (c) => {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return c.json({ error: 'ADMIN_SECRET not configured.' }, 503)
  const auth = c.req.header('authorization') || ''
  if (auth !== `Bearer ${adminSecret}`) return c.json({ error: 'Unauthorized.' }, 401)

  const submissionId = c.req.query('id') || ''
  if (!/^[0-9a-f-]{36}$/i.test(submissionId)) return c.json({ error: 'Invalid submission id.' }, 400)

  const token = signAuditDeleteToken(submissionId)
  return c.json({ token, url: `${SITE_ORIGIN}/data/delete?t=${token}` })
})

app.get('/api/audit/preview-delete', async (c) => {
  const verified = verifyAuditDeleteToken(c.req.query('t'))
  if (!verified) return c.json({ error: 'Invalid or expired link.' }, 401)

  try {
    const rows = await sql`
      SELECT id, audit_ref, email, submitted_at, deleted_at,
             COALESCE(data->>'name', '') AS name,
             COALESCE(data->>'companyName', '') AS company_name
      FROM audit_submissions
      WHERE id = ${verified.submissionId}
      LIMIT 1
    `
    if (rows.length === 0) return c.json({ error: 'Submission not found.' }, 404)
    const row = rows[0] as any
    return c.json({
      auditRef:    row.audit_ref,
      email:       row.email,
      name:        row.name || null,
      companyName: row.company_name || null,
      submittedAt: row.submitted_at,
      alreadyDeleted: row.deleted_at != null,
    })
  } catch (err: any) {
    console.error('[Audit] preview-delete failed:', err)
    return c.json({ error: 'Could not look up your submission.' }, 500)
  }
})

app.post('/api/audit/confirm-delete', async (c) => {
  let body: { t?: string } = {}
  try { body = await c.req.json() } catch { /* ignore */ }
  const verified = verifyAuditDeleteToken(body.t)
  if (!verified) return c.json({ error: 'Invalid or expired link.' }, 401)

  // Look up first so we can clean up the PDF file (if any) before deleting the row
  let pdfPath: string | null = null
  try {
    const rows = await sql`SELECT pdf_path FROM audit_submissions WHERE id = ${verified.submissionId} LIMIT 1`
    if (rows.length === 0) return c.json({ error: 'Submission not found.' }, 404)
    pdfPath = (rows[0] as any).pdf_path
  } catch (err: any) {
    console.error('[Audit] confirm-delete lookup failed:', err)
    return c.json({ error: 'Could not look up your submission.' }, 500)
  }

  // Soft-delete the row and clear PII fields. Hard delete happens via the gdpr_runbook
  // retention sweep — once Kritano's GDPR admin ships, this row will be picked up by
  // its registered source and hard-deleted automatically.
  try {
    await sql`
      UPDATE audit_submissions
      SET deleted_at = now(),
          deletion_reason = 'self-serve via /data/delete',
          email = 'redacted@gdpr.local',
          data = '{}'::jsonb,
          ip_address = NULL,
          user_agent = NULL,
          pdf_path = NULL
      WHERE id = ${verified.submissionId}
    `
  } catch (err: any) {
    console.error('[Audit] confirm-delete update failed:', err)
    return c.json({ error: 'Could not complete deletion. Please email privacy@chrisgarlick.com.' }, 500)
  }

  // Best-effort PDF cleanup; if it fails we've still scrubbed the row
  if (pdfPath) {
    try {
      const { unlink } = await import('node:fs/promises')
      await unlink(pdfPath)
    } catch (err: any) {
      console.warn('[Audit] PDF cleanup failed (non-fatal):', err.message)
    }
  }

  return c.json({ ok: true })
})

// ---------------------------------------------------------------------------
// Audit admin endpoints — backs the /studio/audits review page. Auth is a
// shared secret in ADMIN_SECRET, sent as Authorization: Bearer <secret>.
// Same pattern as the mint-delete-token endpoint above.
// ---------------------------------------------------------------------------

function requireAdmin(c: any): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  const auth = c.req.header('authorization') || ''
  return auth === `Bearer ${adminSecret}`
}

app.get('/api/admin/audits', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const rows = await sql`
      SELECT
        id, audit_ref, email, status, submitted_at, sent_at, deleted_at,
        data->>'companyName'  AS company_name,
        data->>'sector'       AS sector,
        data->>'name'         AS contact_name,
        data->>'budgetRange'  AS budget_range,
        data->>'teamSize'     AS team_size,
        (admin_notes IS NOT NULL AND length(admin_notes) > 0) AS has_notes
      FROM audit_submissions
      ORDER BY submitted_at DESC
      LIMIT 100
    `
    return c.json({ data: rows })
  } catch (err: any) {
    console.error('[Audit] admin list failed:', err)
    return c.json({ error: 'Could not load submissions.' }, 500)
  }
})

app.get('/api/admin/audits/:id', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: 'Invalid submission id.' }, 400)
  try {
    const rows = await sql`SELECT * FROM audit_submissions WHERE id = ${id} LIMIT 1`
    if (rows.length === 0) return c.json({ error: 'Submission not found.' }, 404)
    return c.json({ data: rows[0] })
  } catch (err: any) {
    console.error('[Audit] admin detail failed:', err)
    return c.json({ error: 'Could not load submission.' }, 500)
  }
})

app.patch('/api/admin/audits/:id', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: 'Invalid submission id.' }, 400)

  let body: { adminNotes?: string; status?: string; auditMarkdown?: string } = {}
  try { body = await c.req.json() } catch {}

  // Build the SET clause from whatever the client sent. Only allow specific fields.
  const updates: Record<string, string> = {}
  if (typeof body.adminNotes === 'string')    updates.admin_notes     = body.adminNotes
  if (typeof body.auditMarkdown === 'string') updates.audit_markdown  = body.auditMarkdown
  if (typeof body.status === 'string' && /^[a-z_]+$/.test(body.status)) updates.status = body.status

  if (Object.keys(updates).length === 0) {
    return c.json({ error: 'No valid fields to update.' }, 400)
  }

  try {
    await sql`UPDATE audit_submissions SET ${sql(updates)} WHERE id = ${id}`
    return c.json({ ok: true })
  } catch (err: any) {
    console.error('[Audit] admin patch failed:', err)
    return c.json({ error: 'Could not update submission.' }, 500)
  }
})

// ---------------------------------------------------------------------------
// Diagnostic: 5-question lead qualifier. Stores submission, optional internal notify.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Audit PDF rendering: takes the saved audit_markdown for a submission and
// renders it via typeset.chrisgarlick.com. The PDF is written to disk and the
// path stored on the row so it can be re-served or attached to email later.
// ---------------------------------------------------------------------------
const AUDIT_PDF_DIR = resolve(import.meta.dir, '.audits')
try { mkdirSync(AUDIT_PDF_DIR, { recursive: true }) } catch { /* ignore */ }
const TYPESET_AUDIT_CLIENT = process.env.TYPESET_AUDIT_CLIENT || 'chrisgarlick'

app.post('/api/admin/audits/:id/render', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: 'Invalid submission id.' }, 400)

  // Allow the client to pass the latest markdown in the same request (avoids the
  // race where the user clicks "Render" before the blur-save has reached the DB).
  let body: { markdown?: string } = {}
  try { body = await c.req.json() } catch {}

  const rows = await sql`SELECT audit_ref, audit_markdown FROM audit_submissions WHERE id = ${id} LIMIT 1`
  if (rows.length === 0) return c.json({ error: 'Submission not found.' }, 404)
  const row = rows[0] as { audit_ref: string; audit_markdown: string | null }

  const markdown = (typeof body.markdown === 'string' && body.markdown.length > 0)
    ? body.markdown
    : (row.audit_markdown || '')
  if (markdown.trim().length === 0) {
    return c.json({ error: 'Add some markdown before rendering.' }, 400)
  }

  // Persist whatever we're about to render so the row reflects what produced the PDF.
  await sql`UPDATE audit_submissions SET audit_markdown = ${markdown} WHERE id = ${id}`

  const rendered = await renderViaTypeset({
    slug: `audit-${row.audit_ref}`,
    markdown,
    format: 'pdf',
    client: TYPESET_AUDIT_CLIENT,
  })
  if (!rendered.ok) return c.json({ error: rendered.error }, rendered.status as any)

  const pdfPath = join(AUDIT_PDF_DIR, `${row.audit_ref}.pdf`)
  try {
    await Bun.write(pdfPath, rendered.bytes)
  } catch (err: any) {
    console.error('[Audit] PDF write failed:', err)
    return c.json({ error: 'PDF rendered but could not be saved.' }, 500)
  }

  await sql`UPDATE audit_submissions SET pdf_path = ${pdfPath} WHERE id = ${id}`
  return c.json({ ok: true, audit_ref: row.audit_ref })
})

app.get('/api/admin/audits/:id/pdf', async (c) => {
  if (!requireAdmin(c)) return c.json({ error: 'Unauthorized' }, 401)
  const id = c.req.param('id')
  if (!/^[0-9a-f-]{36}$/i.test(id)) return c.json({ error: 'Invalid submission id.' }, 400)

  const rows = await sql`SELECT audit_ref, pdf_path FROM audit_submissions WHERE id = ${id} LIMIT 1`
  if (rows.length === 0) return c.json({ error: 'Submission not found.' }, 404)
  const { audit_ref, pdf_path } = rows[0] as { audit_ref: string; pdf_path: string | null }
  if (!pdf_path) return c.json({ error: 'No PDF has been rendered yet.' }, 404)

  const file = Bun.file(pdf_path)
  if (!(await file.exists())) return c.json({ error: 'PDF file missing on disk.' }, 410)

  return new Response(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${audit_ref}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
})

app.post('/api/diagnostic', async (c) => {
  let body: Record<string, any>
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid request body.' }, 400)
  }
  if (body._hp) return c.json({ ok: true })

  // Minimal required fields — the other questions are nice-to-have
  if (!body.businessType || !body.task || !body.hours || !body.priority) {
    return c.json({ error: 'Missing required fields.' }, 400)
  }

  const ip = c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() || c.req.header('X-Real-IP') || null
  const userAgent = c.req.header('User-Agent') || null

  try {
    const formRows = await sql`SELECT id FROM forms WHERE slug = 'diagnostic' LIMIT 1`
    if (formRows.length > 0) {
      const formId = (formRows[0] as any).id
      await sql`
        INSERT INTO form_submissions (form_id, data, ip_address, user_agent)
        VALUES (${formId}, ${JSON.stringify(body)}::jsonb, ${ip}, ${userAgent})
      `
    }
  } catch (err: any) {
    console.error('[Diagnostic] DB error:', err)
  }

  // Internal notify — only for high-fit submissions, to avoid noise
  if (body.fitTier === 'high') {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'Chris Garlick <chrisgarlick@kritano.com>'
      const internalTo = process.env.CONTACT_EMAIL || 'cgarlick94@gmail.com'
      const esc = (s: any) => String(s ?? '').replace(/[<>&]/g, '')
      await resend.emails.send({
        from: fromEmail,
        to: internalTo,
        subject: `Diagnostic — high-fit lead (${esc(body.businessType)}, ${esc(body.hours)})`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;color:#111827">
            <p><strong>High-fit diagnostic submission</strong></p>
            <ul style="font-size:14px;line-height:1.7">
              <li>Business type: ${esc(body.businessType)}</li>
              <li>Task: ${esc(body.task)}</li>
              <li>Hours/wk: ${esc(body.hours)}</li>
              <li>Stack: ${esc(body.stack) || '—'}</li>
              <li>Priority: ${esc(body.priority)}</li>
              <li>Email: ${esc(body.email) || '—'}</li>
              <li>Score: ${esc(body.fitScore)} / Tier: ${esc(body.fitTier)}</li>
              <li>IP: ${esc(ip)}</li>
            </ul>
          </div>`,
      })
    } catch (err: any) {
      console.error('[Diagnostic] Notify failed:', err)
    }
  }

  return c.json({ ok: true })
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
  markdown: string | null
  layoutJson?: string | null
  format: 'pdf' | 'docx'
  client?: string | null
}): Promise<{ ok: true; bytes: ArrayBuffer } | { ok: false; status: number; error: string }> {
  if (!TYPESET_API_KEY) {
    return { ok: false, status: 503, error: 'PDF/DOCX rendering is not configured.' }
  }

  // Prefer the structured JSON layout when present — gives us colour, columns,
  // styled containers etc. Falls back to markdown for resources that haven't
  // been migrated yet.
  const useJson = Boolean(opts.layoutJson && opts.layoutJson.trim())
  const content = useJson ? (opts.layoutJson as string) : (opts.markdown || '')
  if (!content) {
    return { ok: false, status: 404, error: 'Resource content not found.' }
  }
  const inputFormat: 'json' | 'markdown' = useJson ? 'json' : 'markdown'

  const clientKey = opts.client || ''
  const hash = createHash('sha256').update(`${opts.slug}|${opts.format}|${inputFormat}|${clientKey}|${content}`).digest('hex').slice(0, 16)
  const cachePath = join(TYPESET_CACHE_DIR, `${opts.slug}-${opts.format}-${hash}.${opts.format}`)
  const cached = Bun.file(cachePath)
  if (await cached.exists()) {
    return { ok: true, bytes: await cached.arrayBuffer() }
  }

  // Document metadata (title/subtitle/author/date) lives in the markdown's YAML
  // frontmatter OR the JSON's `frontmatter` object. The Typeset API treats
  // both identically for cover-page rendering.
  // `input_format` is the discriminator: "markdown" (default) or "json".
  // Styling theme is selected per-resource via the `typesetClient` CMS field,
  // passed as the top-level `client` field on the API request.
  const body: Record<string, unknown> = {
    document_type: 'general',
    format: opts.format,
    input_format: inputFormat,
    content,
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

  // Look up the markdown body + layout JSON + typeset client profile for this resource
  let markdown: string | null = null
  let layoutJson: string | null = null
  let typesetClient: string | null = null
  try {
    const rows = await sql`SELECT markdown_body, layout_json, typeset_client FROM resources WHERE slug = ${slug} LIMIT 1`
    if (rows.length > 0) {
      const row = rows[0] as any
      markdown = row.markdown_body || null
      layoutJson = row.layout_json || null
      typesetClient = row.typeset_client || null
    }
  } catch (err: any) {
    console.error('[Resources] Resource lookup failed:', err)
  }
  if (!markdown && !layoutJson) {
    return c.json({ error: 'Resource content not found.' }, 404)
  }

  logDownload(verified.leadId, slug, format, c)
  refreshLeadCookies(c, verified.leadId)

  if (format === 'md') {
    // The markdown export always serves the markdown source, even if a JSON layout
    // exists. The JSON is a render-time concern — the canonical .md is what a
    // reader can copy, edit, and re-use.
    if (!markdown) {
      return c.json({ error: 'No markdown source for this resource.' }, 404)
    }
    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}.md"`,
        'Cache-Control': 'private, no-store',
      },
    })
  }

  // pdf | docx via typeset — layoutJson wins when present, markdown is the fallback.
  const rendered = await renderViaTypeset({ slug, markdown, layoutJson, format: format as 'pdf' | 'docx', client: typesetClient })
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
