<!-- Version: 1 | Department: content | Updated: 2026-05-02 -->

# Email Templates

## Application Notification (to Chris)

**From:** apply@chrisgarlick.com
**To:** chris@chrisgarlick.com
**Subject:** New application: {{businessName}}

---

**New Application Received**

**Name:** {{name}}
**Email:** {{email}}
**Business:** {{businessName}}
**Industry:** {{industry}}
**Employees:** {{employees}}
**Revenue:** {{revenue}}

**Biggest operational bottleneck:**
{{bottleneck}}

**Referral source:** {{referral || "Not provided"}}

**Submitted:** {{timestamp}}

---

Reply directly to {{email}} or review in the CMS.

---

## Application Confirmation (to applicant)

**From:** chris@chrisgarlick.com
**To:** {{email}}
**Subject:** Application received — Chris Garlick

---

Thanks for getting in touch, {{name}}.

I have received your application and will review it personally. If we are a fit, you will hear back from me within 2 working days.

In the meantime, you can see examples of my work at https://chrisgarlick.com/work.

Chris Garlick
Software Developer
https://chrisgarlick.com
