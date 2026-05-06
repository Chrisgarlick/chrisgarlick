export const prerender = false
import type { APIRoute } from 'astro'

const RECIPIENT = 'cgarlick94@gmail.com'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim()
}

function buildHtmlTable(fields: Record<string, string>): string {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#888;vertical-align:top;">${formatFieldName(key)}</td><td>${value || '—'}</td></tr>`
    )
    .join('')
  return `<table style="border-collapse:collapse;font-family:monospace;font-size:14px;">${rows}</table>`
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Record<string, string>

    if (!body || Object.keys(body).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Empty submission.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate email if provided
    if (body.email && !validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const resendKey = import.meta.env.RESEND_API_KEY
    const emailFrom = import.meta.env.EMAIL_FROM || 'Chris Garlick <support@kritano.com>'

    // Determine a subject line
    const name = body.name || body.Name || 'Someone'
    const businessName = body.businessName || body.business || ''
    const formType = body._formType || (body.bottleneck ? 'application' : 'contact')
    const subject =
      formType === 'application' && businessName
        ? `New application: ${businessName}`
        : `New ${formType} from ${name}`

    // Remove internal fields from display
    const displayFields = { ...body }
    delete displayFields._formType

    if (resendKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)

      // Send notification to you
      await resend.emails.send({
        from: emailFrom,
        to: RECIPIENT,
        subject,
        html: `
          <h2>${subject}</h2>
          ${buildHtmlTable(displayFields)}
        `,
      })

      // Send confirmation to submitter if they provided an email
      if (body.email && validateEmail(body.email)) {
        await resend.emails.send({
          from: emailFrom,
          to: body.email,
          subject: formType === 'application' ? 'Application received' : 'Message received',
          html: `
            <p>Hi ${name},</p>
            <p>Thank you for getting in touch. I review every submission personally and will get back to you within 2 working days.</p>
            <p>Chris Garlick</p>
          `,
        })
      }
    } else {
      console.log('--- FORM SUBMISSION ---')
      console.log(JSON.stringify(body, null, 2))
      console.log('--- END SUBMISSION ---')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Form submission error:', err)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
