import type { APIRoute } from 'astro'

interface ApplicationData {
  name: string
  email: string
  businessName: string
  industry: string
  employees: string
  revenue: string
  bottleneck: string
  referral?: string
}

const REQUIRED_FIELDS: (keyof ApplicationData)[] = [
  'name',
  'email',
  'businessName',
  'industry',
  'employees',
  'revenue',
  'bottleneck',
]

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as ApplicationData

    // Validate required fields
    const missing = REQUIRED_FIELDS.filter((f) => !body[f]?.trim())
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missing.join(', ')}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    if (!validateEmail(body.email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const resendKey = import.meta.env.RESEND_API_KEY

    if (resendKey) {
      // Send emails via Resend
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)

      // Notification to Chris
      await resend.emails.send({
        from: 'Chris Garlick <notifications@chrisgarlick.com>',
        to: 'chris@chrisgarlick.com',
        subject: `New application: ${body.businessName}`,
        html: `
          <h2>New application from ${body.name}</h2>
          <table style="border-collapse:collapse;font-family:monospace;font-size:14px;">
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Name</td><td>${body.name}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Email</td><td>${body.email}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Business</td><td>${body.businessName}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Industry</td><td>${body.industry}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Employees</td><td>${body.employees}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Revenue</td><td>${body.revenue}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#888;">Referral</td><td>${body.referral || '—'}</td></tr>
          </table>
          <h3>Bottleneck</h3>
          <p>${body.bottleneck}</p>
        `,
      })

      // Confirmation to applicant
      await resend.emails.send({
        from: 'Chris Garlick <chris@chrisgarlick.com>',
        to: body.email,
        subject: 'Application received',
        html: `
          <p>Hi ${body.name},</p>
          <p>I have received your application. I review every submission personally and you will hear back within 2 working days.</p>
          <p>Chris Garlick<br/>AI Workflow Partner<br/>chrisgarlick.com</p>
        `,
      })
    } else {
      // Fallback: log to console
      console.log('--- NEW APPLICATION ---')
      console.log(JSON.stringify(body, null, 2))
      console.log('--- END APPLICATION ---')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Application submission error:', err)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
