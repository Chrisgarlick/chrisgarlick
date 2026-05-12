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
          }),
          block('text-section', {
            label:   text(),
            heading: text(),
            body:    richText(),
            ctaLabel: text(),
            ctaUrl:   text(),
          }),
          block('columns', {
            label:   text(),
            heading: text(),
            column1Heading: text(),
            column1Body:    textarea(),
            column2Heading: text(),
            column2Body:    textarea(),
            column3Heading: text(),
            column3Body:    textarea(),
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
          }),
          block('proof-strip', {
            metrics: textarea(),
          }),
          block('case-study-grid', {
            heading: text(),
            subtext: text(),
            limit:   number(),
          }),
          block('blog-preview', {
            heading: text(),
            limit:   number(),
          }),
          block('cta', {
            heading:  text().required(),
            body:     textarea(),
            ctaLabel: text(),
            ctaUrl:   text(),
          }),
          block('tools-teaser', {
            label:        text(),
            tool1Name:    text(),
            tool1Body:    textarea(),
            tool2Name:    text(),
            tool2Body:    textarea(),
          }),
          block('rich-text', {
            body: richText(),
          }),
          block('contact-form', {
            formSlug: text().default(addForm('contact')),
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
