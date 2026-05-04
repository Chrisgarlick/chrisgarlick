import {
  defineConfig,
  defineCollection,
  text, slug, richText, textarea,
  select, media, datetime, seoBlock, number,
  blocks, block, url, addForm,
} from '@kritano/cms/core'

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
        title:         text().required(),
        slug:          slug().from('title'),
        body:          richText(),
        excerpt:       textarea().maxLength(300),
        featuredImage: media(),
        publishedAt:   datetime().nullable(),
        status:        select(['draft', 'published']).default('draft'),
        seo:           seoBlock(),
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
  ],
                      plugins: [
    '@kritano/cms-plugin-io',
  ],
})
