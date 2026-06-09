import {
  defineConfig,
  defineCollection,
  text, slug, richText, textarea,
  select, media, datetime, seoBlock, number,
  blocks, block, url, addForm,
} from '@kritano/cms/core'

// Resource-gate form: submissions appear under /admin/forms/resource-gate alongside the contact form.
// Lead state and per-format download tracking still live in resource_leads / resource_downloads —
// form_submissions is the audit trail for "who submitted, when, with what data".
addForm('resource-gate', {
  name: 'Resource gate',
  fields: [
    { name: 'email',            type: 'email',    label: 'Email',          required: true },
    { name: 'firstName',        type: 'text',     label: 'First name' },
    { name: 'company',          type: 'text',     label: 'Company' },
    { name: 'sector',           type: 'select',   label: 'Sector', options: ['Legal', 'Accountancy', 'Agency', 'Other'] },
    { name: 'marketingConsent', type: 'checkbox', label: 'Marketing consent' },
    { name: 'resourceSlug',     type: 'text',     label: 'Resource', required: true },
  ],
})

// Audit intake form: the bespoke /audit form (see conditional.md). The full sector-specific
// payload lives on audit_submissions.data (jsonb) — only the universally-required fields are
// declared here so the admin's form-submissions view shows something meaningful at a glance.
addForm('audit-intake', {
  name: 'AI Readiness Audit intake',
  fields: [
    { name: 'name',               type: 'text',     label: 'Your name',      required: true },
    { name: 'email',               type: 'email',    label: 'Email',          required: true },
    { name: 'companyName',         type: 'text',     label: 'Company name',   required: true },
    { name: 'website',             type: 'text',     label: 'Website',        required: true },
    { name: 'sector',              type: 'select',   label: 'Sector',         required: true,
      options: ['law-firm', 'accountancy', 'agency', 'consultancy', 'recruitment', 'architecture', 'other'] },
    { name: 'teamSize',            type: 'select',   label: 'Team size',      required: true,
      options: ['Just me', '2-5', '6-15', '16-50', '50+'] },
    { name: 'biggestBottleneck',   type: 'textarea', label: 'Biggest manual bottleneck', required: true },
    { name: 'budgetRange',         type: 'select',   label: 'Budget',
      options: ['£500-2k', '£2-5k', '£5-15k', '£15k+', 'Not sure yet'] },
    { name: 'auditRef',            type: 'text',     label: 'Audit ref' },
  ],
})

// Diagnostic form: 5-question lead qualifier. Submissions appear under /admin/forms/diagnostic.
addForm('diagnostic', {
  name: 'Diagnostic',
  fields: [
    { name: 'businessType', type: 'select',   label: 'Business type', options: ['Agency', 'Professional services', 'E-commerce', 'Other'], required: true },
    { name: 'task',         type: 'textarea', label: 'Task to automate', required: true },
    { name: 'hours',        type: 'select',   label: 'Hours per week', options: ['<2h', '2-10h', '10h+'], required: true },
    { name: 'stack',        type: 'text',     label: 'Existing tools / stack' },
    { name: 'priority',     type: 'select',   label: 'Priority', options: ['Reduce time', 'Reduce errors', 'Scale without hiring', 'All three'], required: true },
    { name: 'email',        type: 'email',    label: 'Email (optional)' },
    { name: 'fitScore',     type: 'text',     label: 'Computed fit score' },
    { name: 'fitTier',      type: 'text',     label: 'Computed fit tier' },
  ],
})

export default defineConfig({
  site: {
    name: 'Chris Garlick',
    domain: 'https://chrisgarlick.com',
    language: 'en',
  },
  collections: [
    defineCollection('page', {
      fields: {
        title:  text().required(),
        slug:   slug().from('title'),
        content: blocks([
          block('hero', {
            label:     text(),
            heading:   text().required(),
            subtext:   textarea(),
            ctaLabel:  text(),
            ctaUrl:    text(),
            ctaSecondaryLabel: text(),
            ctaSecondaryUrl:   text(),
            theme:     select(['light', 'dark']).default('light'),
          }),
          block('text-section', {
            label:   text(),
            heading: text(),
            body:    richText(),
            ctaLabel: text(),
            ctaUrl:   text(),
            theme:   select(['light', 'dark']).default('light'),
          }),
          block('columns', {
            label:   text(),
            heading: text(),
            column1Heading: text(),
            column1Body:    textarea(),
            column1Url:     text(),
            column1CtaLabel:text(),
            column1Tint:    select(['', 'workflow', 'agents', 'data', 'engineering']),
            column2Heading: text(),
            column2Body:    textarea(),
            column2Url:     text(),
            column2CtaLabel:text(),
            column2Tint:    select(['', 'workflow', 'agents', 'data', 'engineering']),
            column3Heading: text(),
            column3Body:    textarea(),
            column3Url:     text(),
            column3CtaLabel:text(),
            column3Tint:    select(['', 'workflow', 'agents', 'data', 'engineering']),
            column4Heading: text(),
            column4Body:    textarea(),
            column4Url:     text(),
            column4CtaLabel:text(),
            column4Tint:    select(['', 'workflow', 'agents', 'data', 'engineering']),
            theme:          select(['light', 'dark']).default('light'),
          }),
          block('offer-cards', {
            card1Label:    text(),
            card1Name:     text(),
            card1Price:    text(),
            card1Duration: text(),
            card1Features: textarea(),
            card2Label:    text(),
            card2Name:     text(),
            card2Price:    text(),
            card2Duration: text(),
            card2Features: textarea(),
            theme:         select(['light', 'dark']).default('light'),
          }),
          block('proof-strip', {
            metrics: textarea(),
            theme:   select(['light', 'dark']).default('light'),
          }),
          block('case-study-grid', {
            heading: text(),
            subtext: text(),
            limit:   number(),
            theme:   select(['light', 'dark']).default('light'),
          }),
          block('blog-preview', {
            heading: text(),
            limit:   number(),
            theme:   select(['light', 'dark']).default('light'),
          }),
          block('cta', {
            heading:  text().required(),
            body:     textarea(),
            ctaLabel: text(),
            ctaUrl:   text(),
            theme:    select(['light', 'dark']).default('light'),
          }),
          block('tools-teaser', {
            label:        text(),
            tool1Name:    text(),
            tool1Body:    textarea(),
            tool2Name:    text(),
            tool2Body:    textarea(),
            theme:        select(['light', 'dark']).default('light'),
          }),
          block('rich-text', {
            body:  richText(),
            theme: select(['light', 'dark']).default('light'),
          }),
          block('contact-form', {
            formSlug: text().default(addForm('contact')),
            theme:    select(['light', 'dark']).default('light'),
          }),
        ]),
        status: select(['draft', 'published']).default('draft'),
        seo:    seoBlock(),
      },
    }),
    defineCollection('article', {
      fields: {
        title:            text().required(),
        slug:             slug().from('title'),
        body:             richText(),
        excerpt:          textarea().maxLength(300),
        featuredImage:    media(),
        publishedAt:      datetime().nullable(),
        relatedResources: text().nullable(),
        status:           select(['draft', 'published']).default('draft'),
        seo:              seoBlock(),
      },
    }),
    defineCollection('caseStudy', {
      fields: {
        title:       text().required(),
        slug:        slug().from('title'),
        body:        richText(),
        category:    select(['Legal', 'Accountancy', 'Agency', 'Internal']),
        result:      text(),
        summary:     textarea().maxLength(300),
        duration:    text(),
        tier:        select(['Build', 'Build + Retainer', 'Retainer']),
        publishedAt: datetime().nullable(),
        status:      select(['draft', 'published']).default('draft'),
        seo:         seoBlock(),
      },
    }),
    defineCollection('proofMetric', {
      fields: {
        text:      text().required(),
        sortOrder: number(),
      },
    }),
    defineCollection('tool', {
      fields: {
        title:       text().required(),
        slug:        slug().from('title'),
        description: textarea().maxLength(300),
        body:        richText(),
        icon:        text(),
        category:    select(['Audit', 'Performance', 'SEO', 'Content', 'AI']),
        status:      select(['draft', 'published']).default('draft'),
        sortOrder:   number(),
        seo:         seoBlock(),
      },
    }),
    defineCollection('resource', {
      fields: {
        title:             text().required(),
        slug:              slug().from('title'),
        summary:           textarea().maxLength(300),
        description:       richText(),
        markdownBody:      textarea(),
        // Optional Typeset JSON layout. When populated, the PDF/DOCX render path
        // sends this as `content` with `input_format: "json"`, bypassing the
        // markdown path. Resources without a layoutJson keep using markdownBody.
        layoutJson:        textarea().nullable(),
        // SEO keywords — comma-separated. `keywords` are 3–5 primary terms,
        // `secondaryKeywords` are 5–15 LSI / supporting terms. Both get
        // combined into the `<meta name="keywords">` tag at render time.
        keywords:          text().nullable(),
        secondaryKeywords: text().nullable(),
        // Typeset client profile slug — sent as the `client` field on every render request.
        typesetClient:     text().nullable(),
        sector:            select(['All', 'Legal', 'Accountancy', 'Agency']).default('All'),
        tier:              select(['1', '2', '3']).default('1'),
        funnelStage:       select(['TOFU', 'MOFU', 'BOFU']).default('TOFU'),
        coverImage:        media(),
        hasDocx:           select(['no', 'yes']).default('no'),
        relatedArticles:   text().nullable(),
        sortOrder:         number(),
        status:            select(['draft', 'published']).default('draft'),
        seo:               seoBlock(),
      },
    }),
  ],
                      plugins: [
    '@kritano/cms-plugin-io',
  ],
})
